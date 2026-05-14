import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: string;
    }
  }
}
