import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asStr, asInt } from '../utils/typeHelpers';

// GET /api/destinations
export const getDestinations = async (req: Request, res: Response) => {
  const province = asStr(req.query.province);
  const difficulty = asStr(req.query.difficulty);
  const featured = asStr(req.query.featured);
  const search = asStr(req.query.search);
  const page = asInt(req.query.page, 1);
  const limit = asInt(req.query.limit, 12);

  const where: any = { active: true };
  if (province) where.province = province;
  if (difficulty) where.difficulty = difficulty.toUpperCase();
  if (featured === 'true') where.featured = true;
  if (search) {
    where.OR = [
      { nameVi: { contains: search } },
      { nameEn: { contains: search } },
      { province: { contains: search } },
    ];
  }

  const skip = (page - 1) * limit;

  const [destinations, total] = await Promise.all([
    prisma.destination.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true, nameVi: true, nameEn: true, slug: true, province: true,
        coverImage: true, difficulty: true, bestSeason: true, altitude: true,
        featured: true, _count: { select: { tours: true, homestays: true } },
      },
    }),
    prisma.destination.count({ where }),
  ]);

  res.json({
    success: true,
    data: destinations,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
};

// GET /api/destinations/featured
export const getFeaturedDestinations = async (req: Request, res: Response) => {
  const destinations = await prisma.destination.findMany({
    where: { active: true, featured: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, nameVi: true, nameEn: true, slug: true, province: true,
      coverImage: true, images: true, difficulty: true, bestSeason: true,
      altitude: true, _count: { select: { tours: true, homestays: true } },
    },
  });
  res.json({ success: true, data: destinations });
};

// GET /api/destinations/:slug
export const getDestinationBySlug = async (req: Request, res: Response) => {
  const slug = asStr(req.params.slug);
  const destination = await prisma.destination.findUnique({
    where: { slug, active: true },
    include: {
      tours: {
        where: { active: true },
        select: {
          id: true, title: true, slug: true, durationDays: true,
          pricePerPerson: true, coverImage: true, maxGroupSize: true, featured: true,
          _count: { select: { reviews: true } },
        },
        orderBy: { featured: 'desc' },
      },
      homestays: {
        where: { active: true },
        select: {
          id: true, name: true, slug: true, pricePerNight: true,
          coverImage: true, maxGuests: true, address: true, featured: true,
          _count: { select: { reviews: true } },
        },
        orderBy: { featured: 'desc' },
      },
    },
  });

  if (!destination) throw createError('Không tìm thấy điểm đến', 404);
  res.json({ success: true, data: destination });
};

// POST /api/destinations (admin)
export const createDestination = async (req: AuthRequest, res: Response) => {
  const destination = await prisma.destination.create({ data: req.body });
  res.status(201).json({ success: true, message: 'Tạo điểm đến thành công', data: destination });
};

// PUT /api/destinations/:id (admin)
export const updateDestination = async (req: AuthRequest, res: Response) => {
  const id = asInt(req.params.id);
  const destination = await prisma.destination.update({
    where: { id },
    data: req.body,
  });
  res.json({ success: true, message: 'Cập nhật thành công', data: destination });
};

// DELETE /api/destinations/:id (admin)
export const deleteDestination = async (req: AuthRequest, res: Response) => {
  const id = asInt(req.params.id);
  await prisma.destination.update({
    where: { id },
    data: { active: false },
  });
  res.json({ success: true, message: 'Đã xoá điểm đến' });
};
