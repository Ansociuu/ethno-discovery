import prisma from '../src/lib/prisma';

async function check() {
  const orderCode = 'ETH1778767336977S9AA';
  const payment = await prisma.payment.findUnique({
    where: { orderCode },
    include: { booking: true }
  });

  if (payment) {
    console.log('✅ Payment found:');
    console.log(JSON.stringify(payment, null, 2));
  } else {
    console.log('❌ Payment NOT found with orderCode:', orderCode);
    const recent = await prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log('Recent payments:', JSON.stringify(recent, null, 2));
  }
  process.exit(0);
}

check();
