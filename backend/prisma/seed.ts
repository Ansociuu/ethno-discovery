import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Admin User ────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ethnodiscovery.vn' },
    update: {},
    create: {
      email: 'admin@ethnodiscovery.vn',
      password: adminPassword,
      name: 'EthnoDiscovery Admin',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Demo user
  const userPassword = await bcrypt.hash('demo123456', 12);
  await prisma.user.upsert({
    where: { email: 'demo@ethnodiscovery.vn' },
    update: {},
    create: {
      email: 'demo@ethnodiscovery.vn',
      password: userPassword,
      name: 'Nguyễn Văn Demo',
      role: 'USER',
    },
  });

  // ─── Destinations ──────────────────────────────────────
  const destinations = [
    {
      nameVi: 'Đồng Văn',
      nameEn: 'Dong Van',
      slug: 'dong-van',
      province: 'Hà Giang',
      description: 'Cao nguyên đá Đồng Văn - Di sản địa chất toàn cầu UNESCO với những thửa ruộng bậc thang, chợ phiên H\'Mông và vách đá hùng vĩ.',
      coverImage: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=1200',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=1200',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      ]),
      altitude: 1600,
      bestSeason: 'Tháng 10 - Tháng 4',
      difficulty: 'MODERATE' as const,
      latitude: 23.2741,
      longitude: 105.3686,
      featured: true,
    },
    {
      nameVi: 'Sapa',
      nameEn: 'Sapa',
      slug: 'sapa',
      province: 'Lào Cai',
      description: 'Thị trấn sương mù Sapa - thiên đường của những thửa ruộng bậc thang Mù Cang Chải, văn hoá H\'Mông và đỉnh Fansipan hùng vĩ.',
      coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
      ]),
      altitude: 1600,
      bestSeason: 'Tháng 9 - Tháng 11 (lúa chín)',
      difficulty: 'MODERATE' as const,
      latitude: 22.3364,
      longitude: 103.8438,
      featured: true,
    },
    {
      nameVi: 'Mộc Châu',
      nameEn: 'Moc Chau',
      slug: 'moc-chau',
      province: 'Sơn La',
      description: 'Cao nguyên Mộc Châu - thiên đường hoa mận trắng, đồng cỏ xanh mênh mông và nền văn hoá Thái, Mường độc đáo.',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      ]),
      altitude: 1050,
      bestSeason: 'Tháng 1 - Tháng 3 (hoa mận)',
      difficulty: 'EASY' as const,
      latitude: 20.8297,
      longitude: 104.6395,
      featured: true,
    },
    {
      nameVi: 'Mù Cang Chải',
      nameEn: 'Mu Cang Chai',
      slug: 'mu-cang-chai',
      province: 'Yên Bái',
      description: 'Vương quốc ruộng bậc thang - những thửa ruộng H\'Mông được UNESCO công nhận là di tích quốc gia đặc biệt, đẹp nhất vào mùa lúa chín tháng 9-10.',
      coverImage: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=1200',
      images: JSON.stringify([]),
      altitude: 1000,
      bestSeason: 'Tháng 9 - Tháng 10',
      difficulty: 'MODERATE' as const,
      latitude: 21.8016,
      longitude: 104.0830,
      featured: false,
    },
    {
      nameVi: 'Bắc Hà',
      nameEn: 'Bac Ha',
      slug: 'bac-ha',
      province: 'Lào Cai',
      description: 'Bắc Hà - nơi của chợ phiên Hoa rực rỡ sắc màu, văn hoá H\'Mông Hoa đặc sắc và những vườn mận trắng tinh khôi.',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      images: JSON.stringify([]),
      altitude: 900,
      bestSeason: 'Chủ nhật hàng tuần (phiên chợ)',
      difficulty: 'EASY' as const,
      latitude: 22.5372,
      longitude: 104.3160,
      featured: false,
    },
  ];

  const createdDests: any[] = [];
  for (const dest of destinations) {
    const d = await prisma.destination.upsert({
      where: { slug: dest.slug },
      update: {},
      create: dest,
    });
    createdDests.push(d);
  }
  console.log(`✅ ${createdDests.length} destinations created`);

  // ─── Tours ─────────────────────────────────────────────
  const tours = [
    {
      destinationId: createdDests[0].id, // Đồng Văn
      hostId: admin.id,
      title: 'Khám Phá Cao Nguyên Đá Đồng Văn 4N3Đ',
      slug: 'kham-pha-cao-nguyen-da-dong-van-4n3d',
      description: 'Hành trình 4 ngày khám phá vẻ đẹp hùng vĩ của Cao Nguyên Đá Đồng Văn - Di sản địa chất toàn cầu UNESCO. Trải nghiệm văn hoá H\'Mông chân thực, ngủ tại homestay bản làng.',
      durationDays: 4,
      maxGroupSize: 12,
      pricePerPerson: 2800000,
      includes: JSON.stringify(['Xe đón từ Hà Nội', 'Homestay 3 đêm', 'Ăn uống (9 bữa)', 'Hướng dẫn viên địa phương', 'Vé tham quan']),
      excludes: JSON.stringify(['Vé máy bay/xe khách đến Hà Nội', 'Chi phí cá nhân', 'Đồ uống có cồn']),
      itinerary: JSON.stringify([
        { day: 1, title: 'Hà Nội → Đồng Văn', activities: ['Khởi hành từ Hà Nội', 'Dừng ăn trưa Yên Minh', 'Tham quan phố cổ Đồng Văn', 'Ngủ tại homestay H\'Mông'] },
        { day: 2, title: 'Đồng Văn - Mã Pí Lèng', activities: ['Đèo Mã Pí Lèng hùng vĩ', 'Sông Nho Quế', 'Dinh họ Vương', 'Phiên chợ địa phương'] },
        { day: 3, title: 'Bản làng H\'Mông', activities: ['Thăm bản Lũng Cú', 'Cột cờ Lũng Cú', 'Trải nghiệm dệt vải', 'Nấu ăn cùng gia đình bản địa'] },
        { day: 4, title: 'Đồng Văn → Hà Nội', activities: ['Thăm chợ phiên sáng', 'Mua quà lưu niệm', 'Di chuyển về Hà Nội'] },
      ]),
      coverImage: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=1200',
      images: JSON.stringify(['https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=1200']),
      featured: true,
    },
    {
      destinationId: createdDests[1].id, // Sapa
      hostId: admin.id,
      title: 'Sapa Trekking & Văn Hoá H\'Mông 3N2Đ',
      slug: 'sapa-trekking-van-hoa-hmong-3n2d',
      description: 'Trek qua những thửa ruộng bậc thang vàng óng, ghé thăm bản Cát Cát, Tả Van và trải nghiệm đời sống người H\'Mông cùng gia đình bản địa.',
      durationDays: 3,
      maxGroupSize: 10,
      pricePerPerson: 2200000,
      includes: JSON.stringify(['Đón tại ga Lào Cai/bến xe Sapa', 'Homestay 2 đêm', 'Ăn uống (6 bữa)', 'Hướng dẫn viên H\'Mông', 'Vé bản Cát Cát']),
      excludes: JSON.stringify(['Vé tàu/xe đến Lào Cai', 'Cáp treo Fansipan', 'Chi phí cá nhân']),
      itinerary: JSON.stringify([
        { day: 1, title: 'Sapa - Bản Cát Cát', activities: ['Check-in homestay', 'Tham quan bản Cát Cát', 'Học làm bánh dày', 'Ngắm hoàng hôn'] },
        { day: 2, title: 'Trek Tả Van - Lao Chải', activities: ['Trek 8km qua ruộng bậc thang', 'Thăm bản Lao Chải', 'Picnic bên suối', 'Đêm lửa trại'] },
        { day: 3, title: 'Chợ phiên Bắc Hà', activities: ['Chợ phiên Bắc Hà sáng sớm', 'Mua sắm thổ cẩm', 'Về Lào Cai'] },
      ]),
      coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
      images: JSON.stringify(['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200']),
      featured: true,
    },
    {
      destinationId: createdDests[2].id, // Mộc Châu
      hostId: admin.id,
      title: 'Mộc Châu Mùa Hoa Mận 2N1Đ',
      slug: 'moc-chau-mua-hoa-man-2n1d',
      description: 'Chuyến đi cuối tuần đến thiên đường hoa mận trắng Mộc Châu. Thưởng thức chè Shan tuyết, khám phá văn hoá Thái và ngủ trong bản làng yên bình.',
      durationDays: 2,
      maxGroupSize: 15,
      pricePerPerson: 1500000,
      includes: JSON.stringify(['Xe từ Hà Nội khứ hồi', 'Homestay 1 đêm', 'Ăn uống (4 bữa)', 'Hướng dẫn viên', 'Tham quan đồi chè']),
      excludes: JSON.stringify(['Chi phí cá nhân', 'Mua sắm']),
      itinerary: JSON.stringify([
        { day: 1, title: 'Hà Nội → Mộc Châu', activities: ['Khởi hành sáng sớm', 'Thăm vườn mận đang nở hoa', 'Đồi chè Shan tuyết', 'Homestay bản Thái'] },
        { day: 2, title: 'Khám phá bản Thái', activities: ['Ăn sáng truyền thống', 'Thăm làng nghề thổ cẩm', 'Khởi hành về Hà Nội'] },
      ]),
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      images: JSON.stringify([]),
      featured: true,
    },
    {
      destinationId: createdDests[3].id, // Mù Cang Chải
      hostId: admin.id,
      title: 'Mù Cang Chải Mùa Vàng 3N2Đ',
      slug: 'mu-cang-chai-mua-vang-3n2d',
      description: 'Chứng kiến kỳ quan ruộng bậc thang H\'Mông chuyển vàng vào mùa lúa chín tháng 9. Một trong những cảnh sắc đẹp nhất Việt Nam.',
      durationDays: 3,
      maxGroupSize: 10,
      pricePerPerson: 2400000,
      includes: JSON.stringify(['Đón tại Nghĩa Lộ', 'Homestay 2 đêm', 'Ăn uống', 'Hướng dẫn viên H\'Mông']),
      excludes: JSON.stringify(['Vé xe đến Nghĩa Lộ', 'Chi phí cá nhân']),
      itinerary: JSON.stringify([
        { day: 1, title: 'Đến Mù Cang Chải', activities: ['Check-in homestay', 'Ngắm hoàng hôn trên đồi'] },
        { day: 2, title: 'Ruộng bậc thang toàn cảnh', activities: ['Điểm ngắm La Pán Tẩn', 'Mâm Xôi', 'Tắm suối bản'] },
        { day: 3, title: 'Chợ phiên và về', activities: ['Chợ phiên Mù Cang Chải', 'Về Hà Nội'] },
      ]),
      coverImage: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=1200',
      images: JSON.stringify([]),
      featured: false,
    },
  ];

  for (const tour of tours) {
    await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: {},
      create: tour,
    });
  }
  console.log(`✅ ${tours.length} tours created`);

  // ─── Homestays ─────────────────────────────────────────
  const homestays = [
    {
      destinationId: createdDests[0].id,
      hostId: admin.id,
      name: 'Nhà Cổ H\'Mông Đồng Văn',
      slug: 'nha-co-hmong-dong-van',
      description: 'Ngôi nhà đất truyền thống 100 năm tuổi giữa lòng phố cổ Đồng Văn. Ngủ trên giường gỗ, sưởi bên bếp lửa, thưởng thức mèn mén buổi sáng.',
      pricePerNight: 450000,
      maxGuests: 6,
      amenities: JSON.stringify(['WiFi', 'Bữa sáng truyền thống', 'Bếp lửa', 'Chăn đệm dày', 'Nhà vệ sinh riêng']),
      coverImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200',
      images: JSON.stringify(['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200']),
      address: 'Phố Cổ Đồng Văn, Hà Giang',
      latitude: 23.2741,
      longitude: 105.3686,
      featured: true,
    },
    {
      destinationId: createdDests[1].id,
      hostId: admin.id,
      name: 'Bản Cát Cát Homestay',
      slug: 'ban-cat-cat-homestay',
      description: 'Homestay nằm giữa bản Cát Cát lịch sử. Phòng rộng rãi với view nhìn thẳng ra ruộng bậc thang. Bữa ăn truyền thống H\'Mông tự nấu.',
      pricePerNight: 380000,
      maxGuests: 8,
      amenities: JSON.stringify(['View ruộng bậc thang', 'Bữa sáng', 'Xe máy cho thuê', 'Hướng dẫn trekking']),
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      images: JSON.stringify([]),
      address: 'Bản Cát Cát, Sa Pa, Lào Cai',
      latitude: 22.3127,
      longitude: 103.8284,
      featured: true,
    },
    {
      destinationId: createdDests[2].id,
      hostId: admin.id,
      name: 'Nhà Sàn Mộc Châu Xanh',
      slug: 'nha-san-moc-chau-xanh',
      description: 'Nhà sàn gỗ truyền thống Thái giữa vườn mận và đồi chè. Yên tĩnh, trong lành, cách trung tâm Mộc Châu 5km.',
      pricePerNight: 320000,
      maxGuests: 10,
      amenities: JSON.stringify(['Nhà sàn gỗ', 'Vườn rau hữu cơ', 'Xe đạp miễn phí', 'BBQ tối']),
      coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
      images: JSON.stringify([]),
      address: 'Bản Dọi, Mộc Châu, Sơn La',
      latitude: 20.8297,
      longitude: 104.6395,
      featured: true,
    },
  ];

  for (const homestay of homestays) {
    await prisma.homestay.upsert({
      where: { slug: homestay.slug },
      update: {},
      create: homestay,
    });
  }
  console.log(`✅ ${homestays.length} homestays created`);

  console.log('\n🎉 Seeding completed!');
  console.log('📧 Admin: admin@ethnodiscovery.vn / admin123456');
  console.log('📧 Demo:  demo@ethnodiscovery.vn / demo123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
