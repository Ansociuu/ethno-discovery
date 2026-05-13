import { PrismaClient } from '@prisma/client';

// Prisma v5: đọc DATABASE_URL từ .env tự động
declare global {
  // Tránh tạo nhiều instance trong development (hot-reload)
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV === 'development') {
  global.__prisma = prisma;
}

export default prisma;
