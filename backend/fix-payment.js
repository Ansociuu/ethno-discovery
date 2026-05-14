const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  try {
    const orderCode = 'ETH1778767336977S9AA';
    const payment = await prisma.payment.findUnique({ where: { orderCode } });

    if (!payment) {
      console.log('❌ Not found');
      return;
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { orderCode },
        data: { status: 'success', transactionId: 'MANUAL_FIX' }
      }),
      prisma.booking.update({
        where: { id: payment.bookingId },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' }
      })
    ]);

    console.log('✅ FIXED payment and booking in DB');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

fix();
