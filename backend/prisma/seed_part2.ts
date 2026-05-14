import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Professional Data Part 2 (Tours)...');

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const destinations = await prisma.destination.findMany();

  if (!admin || destinations.length < 5) {
    console.error('❌ Run Part 1 first!');
    return;
  }

  const tourData = [
    {
      title: 'Hà Giang Loop: Cung Đường Huyền Thoại 4N3Đ',
      slug: 'ha-giang-loop-huyen-thoai-4n3d',
      price: 3500000,
      duration: 4,
      destSlug: 'dong-van',
      description: 'Chinh phục Mã Pí Lèng, chèo thuyền sông Nho Quế và trải nghiệm văn hoá H\'Mông.',
      itinerary: [
        { day: 1, title: 'Hà Nội - Quản Bạ', activities: ['Cổng trời Quản Bạ', 'Núi đôi Cô Tiên'] },
        { day: 2, title: 'Yên Minh - Đồng Văn', activities: ['Dinh họ Vương', 'Phố cổ Đồng Văn'] },
        { day: 3, title: 'Đồng Văn - Mã Pí Lèng', activities: ['Chèo thuyền sông Nho Quế', 'Đèo Mã Pí Lèng'] },
        { day: 4, title: 'Mèo Vạc - Hà Nội', activities: ['Chợ phiên Mèo Vạc', 'Trở về'] }
      ]
    },
    {
      title: 'Sapa Trekking & Bản Làng 3N2Đ',
      slug: 'sapa-trekking-ban-lang-3n2d',
      price: 2800000,
      duration: 3,
      destSlug: 'sapa',
      description: 'Trek qua thung lũng Mường Hoa, ngủ homestay người Giáy tại Tả Van.',
      itinerary: [
        { day: 1, title: 'Sapa - Ý Linh Hồ', activities: ['Trek qua ruộng bậc thang', 'Thăm bản người H\'Mông'] },
        { day: 2, title: 'Lao Chải - Tả Van', activities: ['Khám phá văn hoá người Giáy', 'Nấu ăn cùng người bản địa'] },
        { day: 3, title: 'Giàng Tả Chải - Sapa', activities: ['Thăm thác nước cầu mây', 'Chợ Sapa'] }
      ]
    },
    {
      title: 'Mộc Châu: Thiên Đường Hoa Mận 2N1Đ',
      slug: 'moc-chau-hoa-man-2n1d',
      price: 1600000,
      duration: 2,
      destSlug: 'moc-chau',
      description: 'Khám phá đồi chè trái tim, thung lũng Na Ka rực rỡ sắc hoa.',
      itinerary: [
        { day: 1, title: 'Hà Nội - Mộc Châu', activities: ['Đồi chè trái tim', 'Thác Dải Yếm'] },
        { day: 2, title: 'Thung lũng Na Ka', activities: ['Hái mận tại vườn', 'Về Hà Nội'] }
      ]
    },
    {
      title: 'Mù Cang Chải: Mùa Vàng Ruộng Bậc Thang',
      slug: 'mu-cang-chai-mua-vang-3n2d',
      price: 2400000,
      duration: 3,
      destSlug: 'mu-cang-chai-chai',
      description: 'Săn ảnh tại đồi Mâm Xôi, rừng trúc và đèo Khau Phạ.',
      itinerary: [
        { day: 1, title: 'Hà Nội - Tú Lệ', activities: ['Thưởng thức cốm Tú Lệ', 'Suối khoáng nóng'] },
        { day: 2, title: 'Mù Cang Chải - La Pán Tẩn', activities: ['Đồi Mâm Xôi', 'Ruộng bậc thang'] },
        { day: 3, title: 'Khau Phạ - Hà Nội', activities: ['Bay dù lượn', 'Trở về'] }
      ]
    },
    {
      title: 'Bắc Hà: Phiên Chợ Vùng Cao 2N1Đ',
      slug: 'bac-ha-phien-cho-2n1d',
      price: 1900000,
      duration: 2,
      destSlug: 'bac-ha',
      description: 'Trải nghiệm chợ phiên lớn nhất Tây Bắc, thưởng thức Thắng Cố.',
      itinerary: [
        { day: 1, title: 'Lào Cai - Bắc Hà', activities: ['Dinh Hoàng A Tưởng', 'Bản Phố'] },
        { day: 2, title: 'Chợ phiên Bắc Hà', activities: ['Giao lưu văn hoá', 'Chợ ngựa'] }
      ]
    },
    {
      title: 'Mai Châu: Nếp Nhà Sàn 2N1Đ',
      slug: 'mai-chau-nha-san-2n1d',
      price: 1500000,
      duration: 2,
      destSlug: 'mai-chau',
      description: 'Đạp xe quanh bản Lác, xem múa xòe và uống rượu cần.',
      itinerary: [
        { day: 1, title: 'Hà Nội - Bản Lác', activities: ['Đạp xe quanh bản', 'Múa xoè tối'] },
        { day: 2, title: 'Hang Chiều - Hà Nội', activities: ['Leo núi ngắm cảnh', 'Mua thổ cẩm'] }
      ]
    },
    {
      title: 'Thác Bản Giốc & Động Ngườm Ngao 3N2Đ',
      slug: 'thac-ban-gioc-3n2d',
      price: 3200000,
      duration: 3,
      destSlug: 'cao-bang',
      description: 'Chiêm ngưỡng thác nước đẹp nhất Việt Nam và hệ thống hang động kỳ ảo.',
      itinerary: [
        { day: 1, title: 'Hà Nội - Pác Bó', activities: ['Suối Lê Nin', 'Hang Pác Bó'] },
        { day: 2, title: 'Thác Bản Giốc', activities: ['Đi bè trên sông', 'Động Ngườm Ngao'] },
        { day: 3, title: 'Núi Thủng - Hà Nội', activities: ['Check-in núi mắt thần', 'Trở về'] }
      ]
    },
    {
      title: 'Y Tý: Biển Mây Đại Ngàn 3N2Đ',
      slug: 'y-ty-bien-may-3n2d',
      price: 2900000,
      duration: 3,
      destSlug: 'y-ty',
      description: 'Săn mây tại Choản Thèn, khám phá nhà trình tường Hà Nhì.',
      itinerary: [
        { day: 1, title: 'Lào Cai - Y Tý', activities: ['Cung đường xuyên rừng', 'Check-in mốc biên giới'] },
        { day: 2, title: 'Săn mây Choản Thèn', activities: ['Giao lưu người Hà Nhì', 'Cỏ cháy'] },
        { day: 3, title: 'Lũng Pô - Lào Cai', activities: ['Nơi con sông Hồng chảy vào đất Việt'] }
      ]
    }
  ];

  for (const t of tourData) {
    const dest = destinations.find(d => d.slug === t.destSlug || t.title.toLowerCase().includes(d.nameVi.toLowerCase()));
    if (dest) {
      await prisma.tour.upsert({
        where: { slug: t.slug },
        update: {},
        create: {
          title: t.title,
          slug: t.slug,
          description: t.description,
          durationDays: t.duration,
          pricePerPerson: t.price,
          maxGroupSize: 12,
          destinationId: dest.id,
          hostId: admin.id,
          itinerary: JSON.stringify(t.itinerary),
          includes: JSON.stringify(['Xe đưa đón', 'Homestay', 'Bữa ăn', 'Hướng dẫn viên']),
          excludes: JSON.stringify(['Vé máy bay', 'Đồ uống', 'Chi phí cá nhân']),
          coverImage: dest.coverImage,
          images: JSON.stringify([dest.coverImage]),
          featured: true
        }
      });
    }
  }
  console.log(`✅ Tours created`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
