import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET /api/search
export const search = async (req: Request, res: Response) => {
  const { q, type, province, priceMin, priceMax, duration, start, end, page = '1', limit = '12' } = req.query;

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
    // Availability Filter (Airbnb style)
    // Find homestays that do NOT have any overlapping bookings in the selected range
    let dateFilter = {};
    if (start && end) {
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      dateFilter = {
        bookings: {
          none: {
            status: { not: 'CANCELLED' },
            OR: [
              {
                AND: [
                  { checkIn: { lte: startDate } },
                  { checkOut: { gt: startDate } },
                ],
              },
              {
                AND: [
                  { checkIn: { lt: endDate } },
                  { checkOut: { gte: endDate } },
                ],
              },
              {
                AND: [
                  { checkIn: { gte: startDate } },
                  { checkOut: { lte: endDate } },
                ],
              },
            ],
          },
        },
      };
    }

    results.homestays = await prisma.homestay.findMany({
      where: {
        active: true,
        ...dateFilter,
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

  // Return flat string array for autocomplete
  const suggestions: string[] = [
    ...destinations.map(d => d.nameVi),
    ...provinces.map(p => p.province),
    ...tours.map(t => t.title),
  ].filter((s, i, arr) => s && arr.indexOf(s) === i); // unique, non-empty

  res.json({ success: true, data: suggestions });
};

// GET /api/search/trending
export const getTrending = async (req: Request, res: Response) => {
  const destinations = await prisma.destination.findMany({
    where: { active: true },
    orderBy: { featured: 'desc' },
    take: 8,
    select: { nameVi: true },
  });

  // Return trending as string array for the search page chips
  const trending = destinations.map(d => d.nameVi);

  // Also include some static popular searches
  const popular = ['Trekking Sapa', 'Chợ phiên Bắc Hà', 'Ruộng bậc thang', 'Hà Giang Loop'];
  const allTrending = [...new Set([...trending, ...popular])].slice(0, 8);

  res.json({ success: true, data: allTrending });
};
