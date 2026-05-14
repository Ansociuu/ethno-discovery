const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBooking31() {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: 31 },
      include: {
        payment: true,
        user: true
      }
    });

    console.log('--- Booking #31 Info ---');
    console.log('Status:', booking.status);
    console.log('Total Price:', booking.totalPrice);
    console.log('User:', booking.user.email);
    
    console.log('\n--- Payments for Booking #31 ---');
    if (!booking.payment) {
      console.log('No payment record found.');
    } else {
      const p = booking.payment;
      console.log(`- ID: ${p.id} | Amount: ${p.amount} | Status: ${p.status} | OrderCode: ${p.orderCode}`);
    }

    // Kiểm tra xem có Payment nào có orderCode chứa #31 không
    const allPayments = await prisma.payment.findMany({
      where: {
        orderCode: {
          contains: '31'
        }
      }
    });

    if (allPayments.length > (booking.payment ? 1 : 0)) {
      console.log('\n--- Found other payments mentioning 31 ---');
      allPayments.forEach(p => {
        if (!booking.payment || booking.payment.id !== p.id) {
           console.log(`- ID: ${p.id} | Amount: ${p.amount} | Status: ${p.status} | OrderCode: ${p.orderCode} | BookingID: ${p.bookingId}`);
        }
      });
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

checkBooking31();
