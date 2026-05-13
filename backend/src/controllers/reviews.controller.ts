import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createError } from '../middlewares/error.middleware';
import { asStr, asInt } from '../utils/typeHelpers';

// GET /api/reviews/:type/:id
export const getReviews = async (req: Request, res: Response) => {
  const type = asStr(req.params.type);   // "tour" | "homestay"
  const id = asInt(req.params.id);

  const where: any = {
    reviewableType: type,
    ...(type === 'tour' ? { tourId: id } : { homestayId: id }),
  };

  const reviews = await prisma.review.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, avatarUrl: true } } },
  });

  const avg = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  res.json({
    success: true,
    data: reviews,
    averageRating: Math.round(avg * 10) / 10,
    totalReviews: reviews.length,
  });
};

// POST /api/reviews
export const createReview = async (req: AuthRequest, res: Response) => {
  const { reviewableType, tourId, homestayId, rating, content, images } = req.body;
  const userId = req.user!.id;

  if (!rating || rating < 1 || rating > 5) {
    throw createError('Đánh giá phải từ 1 đến 5 sao', 400);
  }

  const booking = await prisma.booking.findFirst({
    where: {
      userId,
      status: 'COMPLETED',
      ...(reviewableType === 'tour' ? { tourId } : { homestayId }),
    },
  });

  const review = await prisma.review.create({
    data: {
      userId,
      reviewableType,
      tourId: reviewableType === 'tour' ? tourId : null,
      homestayId: reviewableType === 'homestay' ? homestayId : null,
      rating,
      content,
      images: images || [],
      verifiedBooking: !!booking,
    },
    include: { user: { select: { name: true, avatarUrl: true } } },
  });

  res.status(201).json({ success: true, message: 'Đã gửi đánh giá', data: review });
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────

// GET /api/wishlist
export const getWishlist = async (req: AuthRequest, res: Response) => {
  const items = await prisma.wishlist.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: items });
};

// POST /api/wishlist
export const addToWishlist = async (req: AuthRequest, res: Response) => {
  const { itemType, itemId } = req.body;
  const item = await prisma.wishlist.upsert({
    where: { userId_itemType_itemId: { userId: req.user!.id, itemType, itemId } },
    update: {},
    create: { userId: req.user!.id, itemType, itemId },
  });
  res.status(201).json({ success: true, message: 'Đã thêm vào danh sách yêu thích', data: item });
};

// DELETE /api/wishlist/:itemType/:itemId
export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  const itemType = asStr(req.params.itemType);
  const itemId = asInt(req.params.itemId);
  await prisma.wishlist.deleteMany({
    where: { userId: req.user!.id, itemType, itemId },
  });
  res.json({ success: true, message: 'Đã xoá khỏi danh sách yêu thích' });
};
