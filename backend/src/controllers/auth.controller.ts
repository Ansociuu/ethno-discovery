import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';

const generateTokens = (user: { id: number; email: string; role: string }) => {
  const opts: SignOptions = { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any };
  const refreshOpts: SignOptions = { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as any };

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    opts
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET!,
    refreshOpts
  );
  return { accessToken, refreshToken };
};

// POST /api/auth/register
export const register = async (req: Request, res: Response) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name) {
    throw createError('Email, mật khẩu và tên là bắt buộc', 400);
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw createError('Email đã được đăng ký', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, phone },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });

  res.status(201).json({
    success: true,
    message: 'Đăng ký thành công',
    data: { user, ...tokens },
  });
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createError('Email và mật khẩu là bắt buộc', 400);
  }

  const user = await prisma.user.findUnique({ where: { email, isActive: true } });
  if (!user) {
    throw createError('Email hoặc mật khẩu không đúng', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError('Email hoặc mật khẩu không đúng', 401);
  }

  const tokens = generateTokens({ id: user.id, email: user.email, role: user.role });

  res.json({
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatarUrl: user.avatarUrl },
      ...tokens,
    },
  });
};

// POST /api/auth/refresh
export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw createError('Refresh token là bắt buộc', 400);

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { id: number };
  const user = await prisma.user.findUnique({
    where: { id: decoded.id, isActive: true },
    select: { id: true, email: true, role: true },
  });

  if (!user) throw createError('Tài khoản không tồn tại', 401);

  const tokens = generateTokens(user);
  res.json({ success: true, data: tokens });
};

// GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, name: true, phone: true, avatarUrl: true, role: true, createdAt: true },
  });
  res.json({ success: true, data: user });
};

// PATCH /api/auth/me
export const updateMe = async (req: AuthRequest, res: Response) => {
  const { name, phone, avatarUrl } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, phone, avatarUrl },
    select: { id: true, email: true, name: true, phone: true, avatarUrl: true, role: true },
  });
  res.json({ success: true, message: 'Cập nhật thành công', data: user });
};

// POST /api/auth/change-password
export const changePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) throw createError('Không tìm thấy người dùng', 404);

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) throw createError('Mật khẩu hiện tại không đúng', 400);

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  res.json({ success: true, message: 'Đổi mật khẩu thành công' });
};
