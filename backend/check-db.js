const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const orderCode = 'ETH1778767336977S9AA';
    const payment = await prisma.payment.findUnique({
      where: { orderCode },
      include: { booking: true }
    });

    if (payment) {
      console.log('✅ FOUND:', JSON.stringify(payment));
    } else {
      console.log('❌ NOT FOUND');
      const recent = await prisma.payment.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
      });
      console.log('RECENT:', JSON.stringify(recent));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
