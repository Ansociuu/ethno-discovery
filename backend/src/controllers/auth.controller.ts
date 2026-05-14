import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { createError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { sendWelcomeEmail, sendOTPEmail } from '../services/email.service';
import crypto from 'crypto';

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

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Tạo một token tạm thời chứa thông tin đăng ký (hết hạn trong 15p)
  const registrationToken = jwt.sign(
    { name, email, password: hashedPassword, phone, otp },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  await sendOTPEmail(email, name, otp).catch(err => {
    console.error('Failed to send registration OTP email:', err);
  });

  res.status(200).json({
    success: true,
    message: 'Mã xác thực đã được gửi vào email của bạn',
    data: { registrationToken }
  });
};

// POST /api/auth/verify-register
export const verifyRegisterOTP = async (req: Request, res: Response) => {
  const { otp, registrationToken } = req.body;
  if (!otp || !registrationToken) throw createError('Thiếu thông tin xác thực', 400);

  try {
    const decoded = jwt.verify(registrationToken, process.env.JWT_SECRET!) as any;
    
    const submittedOtp = otp.toString().trim();
    const expectedOtp = decoded.otp.toString().trim();

    console.log(`[Debug OTP] Submitted: "${submittedOtp}" | Expected: "${expectedOtp}"`);
    
    if (expectedOtp !== submittedOtp) {
      throw createError('Mã OTP không chính xác', 400);
    }

    // Kiểm tra lại lần cuối xem email đã bị ai khác đăng ký trong lúc chờ không
    const existing = await prisma.user.findUnique({ where: { email: decoded.email } });
    if (existing) throw createError('Email đã được đăng ký', 409);

    // Bây giờ mới chính thức tạo User trong DB
    const user = await prisma.user.create({
      data: { 
        email: decoded.email, 
        password: decoded.password, 
        name: decoded.name, 
        phone: decoded.phone,
        isVerified: true
      },
      select: { id: true, email: true, name: true, role: true }
    });

    const tokens = generateTokens(user);
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    res.json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: { user, ...tokens }
    });
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw createError('Phiên đăng ký đã hết hạn, vui lòng thử lại từ đầu', 400);
    }
    throw err;
  }
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

  if (!user.isVerified && !user.provider) {
    throw createError('Tài khoản chưa được xác thực email. Vui lòng kiểm tra email của bạn.', 403);
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

// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) throw createError('Email là bắt buộc', 400);

  const user = await prisma.user.findUnique({ where: { email, isActive: true } });
  if (!user) {
    // Để bảo mật, không báo lỗi nếu email không tồn tại, chỉ trả về thành công giả
    return res.json({ success: true, message: 'Nếu email tồn tại, mã OTP đã được gửi' });
  }

  // Tạo OTP 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode: otp, otpExpires: expires },
  });

  await sendOTPEmail(user.email, user.name, otp).catch(err => {
    console.error('Failed to send forgot-password OTP email:', err);
  });

  res.json({ success: true, message: 'Mã OTP đã được gửi vào email của bạn' });
};

// POST /api/auth/verify-otp
export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw createError('Email và OTP là bắt buộc', 400);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.otpCode !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    throw createError('Mã OTP không đúng hoặc đã hết hạn', 400);
  }

  res.json({ success: true, message: 'Xác thực OTP thành công' });
};

// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) throw createError('Thiếu thông tin bắt buộc', 400);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.otpCode !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    throw createError('Mã OTP không đúng hoặc đã hết hạn', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { 
      password: hashedPassword, 
      otpCode: null, 
      otpExpires: null 
    },
  });

  res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
};
