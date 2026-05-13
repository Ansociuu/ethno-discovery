import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asStr } from '../utils/typeHelpers';

// Tạo mã đơn hàng unique
const generateOrderCode = () => {
  return `ETH${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};

// POST /api/payments/create
export const createPayment = async (req: AuthRequest, res: Response) => {
  const { bookingId } = req.body;
  const userId = req.user!.id;

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
  });

  if (!booking) throw createError('Không tìm thấy đơn đặt chỗ', 404);
  if (booking.paymentStatus === 'PAID') throw createError('Đơn này đã được thanh toán', 400);

  // Kiểm tra payment đang pending
  const existingPayment = await prisma.payment.findUnique({ where: { bookingId } });
  if (existingPayment && existingPayment.status === 'pending') {
    return res.json({
      success: true,
      data: buildSePayResponse(existingPayment.orderCode, Number(existingPayment.amount)),
    });
  }

  const orderCode = generateOrderCode();
  const amount = Number(booking.totalPrice);

  await prisma.payment.create({
    data: { bookingId, userId, amount: booking.totalPrice, orderCode, provider: 'sepay' },
  });

  res.status(201).json({
    success: true,
    message: 'Tạo đơn thanh toán thành công',
    data: buildSePayResponse(orderCode, amount),
  });
};

// Build SePay payment info (QR + transfer details)
const buildSePayResponse = (orderCode: string, amount: number) => {
  const accountNumber = process.env.SEPAY_ACCOUNT_NUMBER!;
  const bankCode = process.env.SEPAY_BANK_CODE || 'VCB';
  const accountName = process.env.SEPAY_ACCOUNT_NAME || 'ETHNO DISCOVERY';
  const description = `ETHNOPAY ${orderCode}`;
  const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;

  return {
    orderCode,
    amount,
    bankCode,
    accountNumber,
    accountName,
    description,
    qrUrl,
    expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
};

// POST /api/payments/sepay/webhook
export const sePayWebhook = async (req: Request, res: Response) => {
  const webhookSecret = process.env.SEPAY_WEBHOOK_SECRET;

  if (webhookSecret) {
    const signature = req.headers['x-sepay-signature'] as string;
    const payload = JSON.stringify(req.body);
    const expectedSig = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');
    if (signature !== expectedSig) {
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }
  }

  const { content, transferAmount, referenceCode } = req.body;
  const orderCodeMatch = (content as string)?.match(/ETH[A-Z0-9]+/);
  if (!orderCodeMatch) return res.json({ success: true, message: 'No matching order' });

  const orderCode = orderCodeMatch[0];
  const payment = await prisma.payment.findUnique({ where: { orderCode } });
  if (!payment || payment.status === 'success') {
    return res.json({ success: true, message: 'Already processed' });
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { orderCode },
      data: { status: 'success', transactionId: referenceCode, sePayData: req.body },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
    }),
  ]);

  console.log(`✅ Payment confirmed: ${orderCode}`);
  res.json({ success: true, message: 'Payment confirmed' });
};

// GET /api/payments/status/:orderCode
export const getPaymentStatus = async (req: AuthRequest, res: Response) => {
  const orderCode = asStr(req.params.orderCode);
  const payment = await prisma.payment.findUnique({
    where: { orderCode },
    include: { booking: { select: { status: true, paymentStatus: true } } },
  });

  if (!payment) throw createError('Không tìm thấy đơn thanh toán', 404);
  if (payment.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    throw createError('Không có quyền truy cập', 403);
  }

  res.json({
    success: true,
    data: {
      orderCode: payment.orderCode,
      status: payment.status,
      amount: payment.amount,
      paymentStatus: payment.booking.paymentStatus,
      bookingStatus: payment.booking.status,
    },
  });
};
