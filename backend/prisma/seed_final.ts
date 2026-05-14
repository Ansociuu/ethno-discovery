import { PrismaClient, Role, Difficulty } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu khởi tạo dữ liệu chuyên nghiệp (20+ bộ mỗi loại)...');

  // 1. Xoá dữ liệu cũ (tuỳ chọn - để đảm bảo sạch sẽ)
  // await prisma.review.deleteMany();
  // await prisma.payment.deleteMany();
  // await prisma.booking.deleteMany();
  // await prisma.tour.deleteMany();
  // await prisma.homestay.deleteMany();
  // await prisma.destination.deleteMany();

  const password = await bcrypt.hash('admin123456', 12);

  // ─── USERS ──────────────────────────────────────────────
  const users = [
    { email: 'admin@ethnodiscovery.vn', name: 'EthnoDiscovery Admin', role: Role.ADMIN },
    { email: 'host.vangmisinh@ethnodiscovery.vn', name: 'Vàng Mí Sình', role: Role.HOST },
    { email: 'host.lylaolo@ethnodiscovery.vn', name: 'Lý Láo Lở', role: Role.HOST },
    { email: 'demo@ethnodiscovery.vn', name: 'Nguyễn Văn Demo', role: Role.USER },
    { email: 'khachhang01@gmail.com', name: 'Trần Minh Tâm', role: Role.USER },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password },
    });
  }
  const adminUser = await prisma.user.findFirst({ where: { role: Role.ADMIN } });
  const hostUser = await prisma.user.findFirst({ where: { role: Role.HOST } });
  const demoUser = await prisma.user.findFirst({ where: { email: 'demo@ethnodiscovery.vn' } });

  // ─── DESTINATIONS (12 vùng chính) ────────────────────────
  const destinationData = [
    { nameVi: 'Đồng Văn', nameEn: 'Dong Van', slug: 'dong-van', province: 'Hà Giang', difficulty: Difficulty.MODERATE, featured: true, alt: 1600 },
    { nameVi: 'Sapa', nameEn: 'Sapa', slug: 'sapa', province: 'Lào Cai', difficulty: Difficulty.MODERATE, featured: true, alt: 1600 },
    { nameVi: 'Mộc Châu', nameEn: 'Moc Chau', slug: 'moc-chau', province: 'Sơn La', difficulty: Difficulty.EASY, featured: true, alt: 1050 },
    { nameVi: 'Mù Cang Chải', nameEn: 'Mu Cang Chai', slug: 'mu-cang-chai', province: 'Yên Bái', difficulty: Difficulty.MODERATE, featured: true, alt: 1000 },
    { nameVi: 'Mai Châu', nameEn: 'Mai Chau', slug: 'mai-chau', province: 'Hoà Bình', difficulty: Difficulty.EASY, featured: true, alt: 800 },
    { nameVi: 'Y Tý', nameEn: 'Y Ty', slug: 'y-ty', province: 'Lào Cai', difficulty: Difficulty.HARD, featured: false, alt: 2000 },
    { nameVi: 'Bản Giốc', nameEn: 'Ban Gioc', slug: 'ban-gioc', province: 'Cao Bằng', difficulty: Difficulty.EASY, featured: true, alt: 600 },
    { nameVi: 'Hồ Ba Bể', nameEn: 'Ba Be Lake', slug: 'ba-be', province: 'Bắc Kạn', difficulty: Difficulty.EASY, featured: false, alt: 150 },
    { nameVi: 'Điện Biên Phủ', nameEn: 'Dien Bien Phu', slug: 'dien-bien', province: 'Điện Biên', difficulty: Difficulty.EASY, featured: false, alt: 500 },
    { nameVi: 'Pù Luông', nameEn: 'Pu Luong', slug: 'pu-luong', province: 'Thanh Hoá', difficulty: Difficulty.MODERATE, featured: true, alt: 1700 },
    { nameVi: 'Bắc Hà', nameEn: 'Bac Ha', slug: 'bac-ha', province: 'Lào Cai', difficulty: Difficulty.EASY, featured: false, alt: 900 },
    { nameVi: 'Hoàng Su Phì', nameEn: 'Hoang Su Phi', slug: 'hoang-su-phi', province: 'Hà Giang', difficulty: Difficulty.HARD, featured: true, alt: 1500 },
  ];

  const createdDestinations = [];
  for (const d of destinationData) {
    const dest = await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        nameVi: d.nameVi, nameEn: d.nameEn, slug: d.slug, province: d.province,
        altitude: d.alt, difficulty: d.difficulty, featured: d.featured,
        description: `Khám phá vẻ đẹp kỳ vĩ của ${d.nameVi}, nơi hội tụ tinh hoa văn hoá của các dân tộc vùng cao phía Bắc.`,
        coverImage: `https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=1200`,
        images: JSON.stringify([`https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=1200`])
      }
    });
    createdDestinations.push(dest);
  }

  // ─── TOURS (20 Tours) ───────────────────────────────────
  const tourTemplates = [
    'Hành trình di sản', 'Khám phá văn hoá', 'Chinh phục đỉnh cao', 'Mùa lúa chín', 'Săn mây đại ngàn', 
    'Trải nghiệm bản làng', 'Vòng cung Tây Bắc', 'Cung đường huyền thoại', 'Nếp nhà sàn', 'Hương vị vùng cao'
  ];

  for (let i = 1; i <= 20; i++) {
    const dest = createdDestinations[i % createdDestinations.length];
    const template = tourTemplates[i % tourTemplates.length];
    const title = `${template} ${dest.nameVi} ${i}`;
    const slug = `tour-${i}-${dest.slug}`;
    
    await prisma.tour.upsert({
      where: { slug },
      update: {},
      create: {
        title, slug, destinationId: dest.id, hostId: hostUser?.id || adminUser?.id,
        description: `Trải nghiệm tour ${title} độc quyền của EthnoDiscovery. Tham quan các bản làng dân tộc ít người, thưởng thức ẩm thực bản địa và ngắm nhìn cảnh sắc hùng vĩ.`,
        durationDays: 2 + (i % 4),
        maxGroupSize: 10 + (i % 5),
        pricePerPerson: 1500000 + (i * 100000),
        featured: i % 5 === 0,
        coverImage: dest.coverImage,
        itinerary: JSON.stringify([
          { day: 1, title: 'Khởi hành', activities: ['Đón khách', 'Di chuyển đến điểm dừng', 'Check-in homestay'] },
          { day: 2, title: 'Trải nghiệm', activities: ['Trekking bản làng', 'Tham quan danh thắng', 'Tiệc tối văn nghệ'] }
        ]),
      }
    });
  }

  // ─── HOMESTAYS (20 Homestays) ───────────────────────────
  for (let i = 1; i <= 20; i++) {
    const dest = createdDestinations[i % createdDestinations.length];
    const name = `${dest.nameVi} Eco Homestay ${i}`;
    const slug = `homestay-${i}-${dest.slug}`;
    
    await prisma.homestay.upsert({
      where: { slug },
      update: {},
      create: {
        name, slug, destinationId: dest.id, hostId: hostUser?.id || adminUser?.id,
        description: `Không gian nghỉ dưỡng yên bình tại ${name}. Thiết kế theo phong cách nhà sàn truyền thống, đầy đủ tiện nghi và gần gũi thiên nhiên.`,
        pricePerNight: 350000 + (i * 50000),
        maxGuests: 4 + (i % 3),
        address: `Bản làng ${i}, ${dest.nameVi}, ${dest.province}`,
        amenities: JSON.stringify(['WiFi', 'Nước nóng', 'Bữa sáng', 'View núi']),
        coverImage: `https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200`,
        featured: i % 4 === 0
      }
    });
  }

  // ─── REVIEWS (20 Reviews) ──────────────────────────────
  const allTours = await prisma.tour.findMany({ take: 10 });
  const allHomestays = await prisma.homestay.findMany({ take: 10 });
  const reviewContent = [
    "Tuyệt vời!", "Chuyến đi đáng nhớ.", "Dịch vụ rất tốt.", "Cảnh đẹp mê hồn.", "Hướng dẫn viên nhiệt tình.",
    "Homestay sạch sẽ.", "Đồ ăn ngon tuyệt.", "Rất hài lòng.", "Sẽ quay lại lần sau.", "Đáng đồng tiền bát gạo."
  ];

  for (let i = 0; i < 20; i++) {
    const isTour = i < 10;
    const target = isTour ? allTours[i] : allHomestays[i - 10];
    await prisma.review.create({
      data: {
        userId: demoUser?.id || 1,
        rating: 4 + (i % 2),
        content: reviewContent[i % reviewContent.length],
        reviewableType: isTour ? 'tour' : 'homestay',
        tourId: isTour ? target.id : null,
        homestayId: !isTour ? target.id : null,
      }
    });
  }

  console.log('✅ Đã khởi tạo thành công: 5 Users, 12 Destinations, 20 Tours, 20 Homestays, 20 Reviews.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
