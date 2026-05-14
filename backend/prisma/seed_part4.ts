import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Professional Data Part 4 (Reviews)...');

  const users = await prisma.user.findMany({ where: { role: 'USER' } });
  const tours = await prisma.tour.findMany();
  const homestays = await prisma.homestay.findMany();

  if (users.length === 0 || tours.length === 0) {
    console.error('❌ Run previous parts first!');
    return;
  }

  const reviewTexts = [
    "Một chuyến đi tuyệt vời, hướng dẫn viên rất nhiệt tình và am hiểu văn hoá địa phương.",
    "Homestay sạch sẽ, view nhìn thẳng ra ruộng bậc thang rất đẹp. Sẽ quay lại!",
    "Lịch trình hợp lý, không quá mệt. Đồ ăn bản địa rất ngon và lạ miệng.",
    "Trải nghiệm AI Planner rất thú vị, giúp mình tiết kiệm nhiều thời gian lên kế hoạch.",
    "Cảnh sắc Tây Bắc thực sự hùng vĩ, chuyến đi để lại nhiều kỷ niệm khó quên.",
    "Người dân địa phương rất thân thiện và hiếu khách. Rất đáng trải nghiệm.",
    "Dịch vụ chuyên nghiệp, xe đưa đón đúng giờ và an toàn.",
    "Thanh toán qua VietQR rất tiện lợi và nhanh chóng.",
    "Chuyến đi giúp mình hiểu thêm nhiều về phong tục tập quán của người H'Mông.",
    "Vẻ đẹp của Thác Bản Giốc thực sự làm mình choáng ngợp.",
    "Mùa lúa chín ở Mù Cang Chải đẹp như một bức tranh.",
    "Thung lũng Mai Châu rất yên bình, phù hợp để nghỉ dưỡng cuối tuần.",
    "Săn mây ở Y Tý là trải nghiệm đỉnh nhất mình từng có.",
    "Đồi chè Mộc Châu xanh mướt, không khí rất trong lành.",
    "Chợ phiên Bắc Hà rực rỡ sắc màu, mình đã mua được nhiều đồ thổ cẩm đẹp.",
    "Hành trình Hà Giang Loop rất thử thách nhưng vô cùng xứng đáng.",
    "Phòng ở Sapa Clay House cực kỳ sang trọng và ấm cúng.",
    "Cảm ơn EthnoDiscovery đã tổ chức một chuyến đi hoàn hảo cho gia đình mình.",
    "Giá cả hợp lý so với chất lượng dịch vụ nhận được.",
    "Sẽ giới thiệu cho bạn bè về nền tảng tuyệt vời này!"
  ];

  for (let i = 0; i < 20; i++) {
    const isTour = i % 2 === 0;
    const target = isTour ? tours[i % tours.length] : homestays[i % homestays.length];
    
    await prisma.review.create({
      data: {
        userId: users[i % users.length].id,
        rating: 4 + Math.floor(Math.random() * 2), // 4 or 5 stars
        comment: reviewTexts[i],
        itemType: isTour ? 'TOUR' : 'HOMESTAY',
        itemId: target.id
      }
    });
  }

  console.log('✅ 20 reviews created');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
