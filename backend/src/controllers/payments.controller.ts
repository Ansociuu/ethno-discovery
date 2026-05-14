import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../lib/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asStr } from '../utils/typeHelpers';
import { sendBookingPendingEmail, sendPaymentSuccessEmail } from '../services/email.service';

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
    include: { user: true, tour: true, homestay: true }
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

  const itemName = booking.bookableType === 'tour' ? booking.tour?.title : booking.homestay?.name;
  const paymentLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/bookings/${bookingId}/payment`;

  // Send email async
  if (booking.user?.email) {
    sendBookingPendingEmail(
      booking.user.email,
      booking.user.name || 'Quý khách',
      bookingId,
      itemName || 'Dịch vụ EthnoDiscovery',
      amount,
      paymentLink
    );
  }

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
  console.log(`📥 Webhook Header:`, req.headers['content-type']);
  const webhookSecret = process.env.SEPAY_WEBHOOK_SECRET;
  
  if (webhookSecret) {
    const signature = (req.headers['x-sepay-signature'] as string || '').trim();
    const rawBody = req.body instanceof Buffer ? req.body.toString() : JSON.stringify(req.body);
    const expectedSig = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    
    if (signature !== expectedSig) {
      console.log(`❌ Sig FAIL! Payload snippet: ${rawBody.substring(0, 50)}...`);
      console.log(`🔐 Expected: ${expectedSig}`);
      console.log(`🔐 Received: ${signature}`);
      return res.status(401).json({ success: false, message: 'Invalid signature' });
    }
    console.log('✅ Sig MATCH');
  } else {
    console.log('⚠️ SEPAY_WEBHOOK_SECRET not set, skipping signature check');
  }

  // Nếu là Buffer (do express.raw), parse thành JSON object
  const body = req.body instanceof Buffer ? JSON.parse(req.body.toString()) : req.body;
  const { content, transferAmount, referenceCode } = body;

  console.log(`📥 Received SePay Webhook:`, { content, transferAmount, referenceCode });
  
  // Sửa Regex để tránh khớp với prefix "ETHNOPAY"
  // OrderCode có dạng ETH + timestamp + random string, nên có số ngay sau ETH
  const orderCodeMatch = (content as string)?.match(/ETH\d+[A-Z0-9]*/);
  if (!orderCodeMatch) {
    console.log(`⚠️ Webhook received but no order code found in content: "${content}"`);
    return res.json({ success: true, message: 'No matching order code' });
  }

  const orderCode = orderCodeMatch[0];
  console.log(`🔍 Extracted orderCode: ${orderCode}`);

  const payment = await prisma.payment.findUnique({ 
    where: { orderCode },
    include: { booking: { include: { user: true, tour: true, homestay: true } } } 
  });

  if (!payment) {
    console.log(`⚠️ Order code ${orderCode} not found in database`);
    return res.json({ success: true, message: 'Order not found' });
  }

  console.log(`💳 Found payment for ${orderCode}, expected amount: ${payment.amount}`);

  if (payment.status === 'success') {
    return res.json({ success: true, message: 'Already processed' });
  }

  // Kiểm tra số tiền
  if (Number(transferAmount) < Number(payment.amount)) {
    console.log(`⚠️ Partial payment for ${orderCode}: expected ${payment.amount}, got ${transferAmount}`);
    return res.json({ success: true, message: 'Partial payment received' });
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { orderCode },
      data: { status: 'success', transactionId: referenceCode, sePayData: body },
    }),
    prisma.booking.update({
      where: { id: payment.bookingId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
    }),
  ]);

  console.log(`✅ Payment confirmed and booking updated: ${orderCode}`);

  const itemName = payment.booking.bookableType === 'tour' ? payment.booking.tour?.title : payment.booking.homestay?.name;
  if (payment.booking.user?.email) {
    sendPaymentSuccessEmail(
      payment.booking.user.email,
      payment.booking.user.name || 'Quý khách',
      payment.bookingId,
      itemName || 'Dịch vụ EthnoDiscovery'
    );
  }

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
