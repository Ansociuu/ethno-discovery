import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asStr, asInt } from '../utils/typeHelpers';

// POST /api/bookings
export const createBooking = async (req: AuthRequest, res: Response) => {
  const { bookableType, tourId, homestayId, checkIn, checkOut, guests, addOns, notes } = req.body;
  const userId = req.user!.id;

  if (!bookableType || !checkIn || !checkOut || !guests) {
    throw createError('Thiếu thông tin đặt chỗ', 400);
  }

  let unitPrice = 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (bookableType === 'tour' && tourId) {
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) throw createError('Tour không tồn tại', 404);
    
    // Kiểm tra sức chứa của tour vào ngày này
    const confirmedGuests = await prisma.booking.aggregate({
      where: {
        tourId,
        checkIn: start,
        status: { in: ['PENDING', 'CONFIRMED'] }
      },
      _sum: { guests: true }
    });
    
    const currentTotal = confirmedGuests._sum.guests || 0;
    if (currentTotal + guests > tour.maxGroupSize) {
      throw createError(`Tour đã hết chỗ vào ngày này (Còn lại ${tour.maxGroupSize - currentTotal} chỗ)`, 400);
    }
    
    unitPrice = Number(tour.pricePerPerson);
  } else if (bookableType === 'homestay' && homestayId) {
    const homestay = await prisma.homestay.findUnique({ where: { id: homestayId } });
    if (!homestay) throw createError('Homestay không tồn tại', 404);

    // Kiểm tra trùng lịch homestay
    const overlapping = await prisma.booking.findFirst({
      where: {
        homestayId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        AND: [
          { checkIn: { lt: end } },
          { checkOut: { gt: start } }
        ]
      }
    });

    if (overlapping) {
      throw createError('Homestay đã có khách đặt trong khoảng thời gian này', 400);
    }

    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    unitPrice = Number(homestay.pricePerNight) * (nights || 1);
  } else {
    throw createError('Loại đặt chỗ không hợp lệ', 400);
  }

  const totalPrice = bookableType === 'tour' ? unitPrice * guests : unitPrice;

  const booking = await prisma.booking.create({
    data: {
      userId,
      bookableType,
      tourId: bookableType === 'tour' ? tourId : null,
      homestayId: bookableType === 'homestay' ? homestayId : null,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      totalPrice,
      addOns,
      notes,
    },
    include: {
      tour: { select: { title: true, coverImage: true } },
      homestay: { select: { name: true, coverImage: true } },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Đặt chỗ thành công',
    data: booking,
  });
};

// GET /api/bookings/my
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  const status = asStr(req.query.status);
  const page = asInt(req.query.page, 1);
  const limit = asInt(req.query.limit, 10);

  const where: any = { userId: req.user!.id };
  if (status) where.status = status.toUpperCase();

  const skip = (page - 1) * limit;
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        tour: { select: { title: true, coverImage: true, slug: true } },
        homestay: { select: { name: true, coverImage: true, slug: true } },
        payment: { select: { status: true, orderCode: true } },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({
    success: true,
    data: bookings,
    pagination: { page, limit, total },
  });
};

// GET /api/bookings/:id
export const getBookingById = async (req: AuthRequest, res: Response) => {
  const id = asInt(req.params.id);
  const booking = await prisma.booking.findFirst({
    where: { id, userId: req.user!.id },
    include: { tour: true, homestay: true, payment: true },
  });

  if (!booking) throw createError('Không tìm thấy đơn đặt chỗ', 404);
  res.json({ success: true, data: booking });
};

// PUT /api/bookings/:id/cancel
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  const id = asInt(req.params.id);
  const booking = await prisma.booking.findFirst({
    where: { id, userId: req.user!.id },
  });

  if (!booking) throw createError('Không tìm thấy đơn đặt chỗ', 404);
  if (booking.status === 'CONFIRMED') {
    throw createError('Không thể huỷ đơn đã được xác nhận. Vui lòng liên hệ hỗ trợ', 400);
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: 'CANCELLED' },
  });

  res.json({ success: true, message: 'Đã huỷ đơn đặt chỗ', data: updated });
};

// GET /api/bookings/admin (admin)
export const getAllBookings = async (req: Request, res: Response) => {
  const status = asStr(req.query.status);
  const page = asInt(req.query.page, 1);
  const limit = asInt(req.query.limit, 20);

  const where: any = {};
  if (status) where.status = status.toUpperCase();

  const skip = (page - 1) * limit;
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        tour: { select: { title: true } },
        homestay: { select: { name: true } },
        payment: true,
      },
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({
    success: true,
    data: bookings,
    pagination: { page, limit, total },
  });
};
