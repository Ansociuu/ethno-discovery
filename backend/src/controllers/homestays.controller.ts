import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asStr, asInt, asFloat } from '../utils/typeHelpers';

// GET /api/homestays
export const getHomestays = async (req: Request, res: Response) => {
  const destinationId = req.query.destinationId ? asInt(req.query.destinationId) : undefined;
  const priceMin = req.query.priceMin ? asFloat(req.query.priceMin) : undefined;
  const priceMax = req.query.priceMax ? asFloat(req.query.priceMax) : undefined;
  const maxGuests = req.query.maxGuests ? asInt(req.query.maxGuests) : undefined;
  const featured = asStr(req.query.featured);
  const search = asStr(req.query.search);
  const page = asInt(req.query.page, 1);
  const limit = asInt(req.query.limit, 12);

  const where: any = { active: true };
  if (destinationId) where.destinationId = destinationId;
  if (featured === 'true') where.featured = true;
  if (maxGuests !== undefined) where.maxGuests = { gte: maxGuests };
  if (priceMin !== undefined || priceMax !== undefined) {
    where.pricePerNight = {};
    if (priceMin !== undefined) where.pricePerNight.gte = priceMin;
    if (priceMax !== undefined) where.pricePerNight.lte = priceMax;
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { address: { contains: search } },
    ];
  }

  const skip = (page - 1) * limit;

  const [homestays, total] = await Promise.all([
    prisma.homestay.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: {
        destination: { select: { nameVi: true, slug: true, province: true } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.homestay.count({ where }),
  ]);

  res.json({
    success: true,
    data: homestays,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

// GET /api/homestays/featured
export const getFeaturedHomestays = async (req: Request, res: Response) => {
  const homestays = await prisma.homestay.findMany({
    where: { active: true, featured: true },
    take: 6,
    include: {
      destination: { select: { nameVi: true, slug: true, province: true } },
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: homestays });
};

// GET /api/homestays/:id
export const getHomestayById = async (req: Request, res: Response) => {
  const id = asInt(req.params.id);
  const homestay = await prisma.homestay.findUnique({
    where: { id, active: true },
    include: {
      destination: true,
      reviews: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, avatarUrl: true } } },
      },
      _count: { select: { reviews: true, bookings: true } },
    },
  });

  if (!homestay) throw createError('Không tìm thấy homestay', 404);
  res.json({ success: true, data: homestay });
};

// POST /api/homestays (admin/host)
export const createHomestay = async (req: AuthRequest, res: Response) => {
  const homestay = await prisma.homestay.create({
    data: { ...req.body, hostId: req.user!.id },
  });
  res.status(201).json({ success: true, message: 'Tạo homestay thành công', data: homestay });
};

// PUT /api/homestays/:id (admin/host)
export const updateHomestay = async (req: AuthRequest, res: Response) => {
  const id = asInt(req.params.id);
  const homestay = await prisma.homestay.update({
    where: { id },
    data: req.body,
  });
  res.json({ success: true, message: 'Cập nhật homestay thành công', data: homestay });
};

// DELETE /api/homestays/:id (admin)
export const deleteHomestay = async (req: AuthRequest, res: Response) => {
  const id = asInt(req.params.id);
  await prisma.homestay.update({
    where: { id },
    data: { active: false },
  });
  res.json({ success: true, message: 'Đã xoá homestay' });
};
