import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET /api/search
export const search = async (req: Request, res: Response) => {
  const { q, type, province, priceMin, priceMax, duration, page = '1', limit = '12' } = req.query;

  if (!q) {
    return res.json({ success: true, data: { tours: [], homestays: [], destinations: [] } });
  }

  const query = q as string;

  const results: any = {};

  if (!type || type === 'tour') {
    results.tours = await prisma.tour.findMany({
      where: {
        active: true,
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
        ...(province ? { destination: { province: province as string } } : {}),
        ...(priceMin || priceMax ? {
          pricePerPerson: {
            ...(priceMin ? { gte: parseFloat(priceMin as string) } : {}),
            ...(priceMax ? { lte: parseFloat(priceMax as string) } : {}),
          },
        } : {}),
        ...(duration ? { durationDays: parseInt(duration as string) } : {}),
      },
      take: 6,
      include: {
        destination: { select: { nameVi: true, province: true } },
      },
    });
  }

  if (!type || type === 'homestay') {
    results.homestays = await prisma.homestay.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { address: { contains: query } },
        ],
        ...(province ? { destination: { province: province as string } } : {}),
      },
      take: 6,
      include: {
        destination: { select: { nameVi: true, province: true } },
      },
    });
  }

  if (!type || type === 'destination') {
    results.destinations = await prisma.destination.findMany({
      where: {
        active: true,
        OR: [
          { nameVi: { contains: query } },
          { nameEn: { contains: query } },
          { province: { contains: query } },
          { description: { contains: query } },
        ],
      },
      take: 6,
    });
  }

  res.json({ success: true, data: results, query });
};

// GET /api/search/suggestions
export const getSuggestions = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || (q as string).length < 2) {
    return res.json({ success: true, data: [] });
  }

  const query = q as string;

  const [tours, destinations, provinces] = await Promise.all([
    prisma.tour.findMany({
      where: { active: true, title: { contains: query } },
      take: 3,
      select: { id: true, title: true, slug: true },
    }),
    prisma.destination.findMany({
      where: { active: true, OR: [{ nameVi: { contains: query } }, { nameEn: { contains: query } }] },
      take: 3,
      select: { id: true, nameVi: true, nameEn: true, slug: true },
    }),
    prisma.destination.findMany({
      where: { active: true, province: { contains: query } },
      distinct: ['province'],
      take: 2,
      select: { province: true },
    }),
  ]);

  const suggestions = [
    ...tours.map(t => ({ type: 'tour', label: t.title, slug: t.slug })),
    ...destinations.map(d => ({ type: 'destination', label: d.nameVi, slug: d.slug })),
    ...provinces.map(p => ({ type: 'province', label: p.province })),
  ];

  res.json({ success: true, data: suggestions });
};

// GET /api/search/trending
export const getTrending = async (req: Request, res: Response) => {
  const [featuredTours, featuredDestinations] = await Promise.all([
    prisma.tour.findMany({
      where: { active: true, featured: true },
      take: 4,
      select: { id: true, title: true, slug: true, coverImage: true, pricePerPerson: true },
    }),
    prisma.destination.findMany({
      where: { active: true, featured: true },
      take: 4,
      select: { id: true, nameVi: true, slug: true, coverImage: true, province: true },
    }),
  ]);

  res.json({ success: true, data: { tours: featuredTours, destinations: featuredDestinations } });
};
