import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asStr, asInt, asFloat } from '../utils/typeHelpers';

// GET /api/tours
export const getTours = async (req: Request, res: Response) => {
  const destinationId = req.query.destinationId ? asInt(req.query.destinationId) : undefined;
  const duration = req.query.duration ? asInt(req.query.duration) : undefined;
  const priceMin = req.query.priceMin ? asFloat(req.query.priceMin) : undefined;
  const priceMax = req.query.priceMax ? asFloat(req.query.priceMax) : undefined;
  const featured = asStr(req.query.featured);
  const search = asStr(req.query.search);
  const sortBy = asStr(req.query.sortBy) || 'featured';
  const page = asInt(req.query.page, 1);
  const limit = asInt(req.query.limit, 12);

  const where: any = { active: true };
  if (destinationId) where.destinationId = destinationId;
  if (featured === 'true') where.featured = true;
  if (duration) where.durationDays = duration;
  if (priceMin !== undefined || priceMax !== undefined) {
    where.pricePerPerson = {};
    if (priceMin !== undefined) where.pricePerPerson.gte = priceMin;
    if (priceMax !== undefined) where.pricePerPerson.lte = priceMax;
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const skip = (page - 1) * limit;
  const orderBy: any = sortBy === 'price_asc'
    ? { pricePerPerson: 'asc' } : sortBy === 'price_desc'
    ? { pricePerPerson: 'desc' } : [{ featured: 'desc' }, { createdAt: 'desc' }];

  const [tours, total] = await Promise.all([
    prisma.tour.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        destination: { select: { nameVi: true, nameEn: true, slug: true, province: true } },
        _count: { select: { reviews: true, bookings: true } },
      },
    }),
    prisma.tour.count({ where }),
  ]);

  res.json({
    success: true,
    data: tours,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

// GET /api/tours/featured
export const getFeaturedTours = async (req: Request, res: Response) => {
  const tours = await prisma.tour.findMany({
    where: { active: true, featured: true },
    take: 8,
    include: {
      destination: { select: { nameVi: true, slug: true, province: true } },
      _count: { select: { reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: tours });
};

// GET /api/tours/:id
export const getTourById = async (req: Request, res: Response) => {
  const id = asInt(req.params.id);
  const tour = await prisma.tour.findUnique({
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

  if (!tour) throw createError('Không tìm thấy tour', 404);
  res.json({ success: true, data: tour });
};

// POST /api/tours (admin/host)
export const createTour = async (req: AuthRequest, res: Response) => {
  const tour = await prisma.tour.create({
    data: { ...req.body, hostId: req.user!.id },
  });
  res.status(201).json({ success: true, message: 'Tạo tour thành công', data: tour });
};

// PUT /api/tours/:id (admin/host)
export const updateTour = async (req: AuthRequest, res: Response) => {
  const id = asInt(req.params.id);
  const tour = await prisma.tour.update({
    where: { id },
    data: req.body,
  });
  res.json({ success: true, message: 'Cập nhật tour thành công', data: tour });
};

// DELETE /api/tours/:id (admin)
export const deleteTour = async (req: AuthRequest, res: Response) => {
  const id = asInt(req.params.id);
  await prisma.tour.update({
    where: { id },
    data: { active: false },
  });
  res.json({ success: true, message: 'Đã xoá tour' });
};
