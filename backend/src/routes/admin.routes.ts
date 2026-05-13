import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import prisma from '../lib/prisma';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  const [
    totalUsers,
    totalDestinations,
    totalTours,
    totalHomestays,
    totalBookings,
    monthlyRevenue,
    recentBookings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.destination.count({ where: { active: true } }),
    prisma.tour.count({ where: { active: true } }),
    prisma.homestay.count({ where: { active: true } }),
    prisma.booking.count(),
    prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: {
        status: 'CONFIRMED',
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        tour: { select: { title: true } },
        homestay: { select: { name: true } },
      },
    }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalDestinations,
      totalTours,
      totalHomestays,
      totalBookings,
      monthlyRevenue: Number(monthlyRevenue._sum.totalPrice || 0),
      recentBookings,
    },
  });
});

// GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const status = req.query.status as string;

  const where: any = {};
  if (status) where.status = status;

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where, skip: (page - 1) * limit, take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        tour: { select: { title: true, coverImage: true } },
        homestay: { select: { name: true, coverImage: true } },
        payment: { select: { status: true, amount: true } },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({ success: true, data: bookings, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
});

// PATCH /api/admin/bookings/:id/status
router.patch('/bookings/:id/status', async (req, res) => {
  const { status } = req.body;
  const booking = await prisma.booking.update({
    where: { id: Number(req.params.id) },
    data: { status },
  });
  res.json({ success: true, data: booking });
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * limit, take: limit,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { bookings: true } } },
    }),
    prisma.user.count(),
  ]);

  res.json({ success: true, data: users, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
});

// PATCH /api/admin/users/:id/role
router.patch('/users/:id/role', async (req, res) => {
  const { role } = req.body;
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
  res.json({ success: true, data: user });
});

export default router;
