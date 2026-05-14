import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Professional Data Part 1...');

  // ─── Users ──────────────────────────────────────────────
  const password = await bcrypt.hash('admin123456', 12);
  
  const users = [
    { email: 'admin@ethnodiscovery.vn', name: 'EthnoDiscovery Admin', role: 'ADMIN' },
    { email: 'host.ha.giang@ethnodiscovery.vn', name: 'Vàng Mí Sình', role: 'ADMIN' },
    { email: 'host.sapa@ethnodiscovery.vn', name: 'Lý Láo Lở', role: 'ADMIN' },
    { email: 'demo@ethnodiscovery.vn', name: 'Nguyễn Văn Demo', role: 'USER' },
    { email: 'guest@ethnodiscovery.vn', name: 'Trần Thị Khách', role: 'USER' },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password },
    });
  }
  console.log('✅ Users & Hosts created');

  // ─── Destinations (10 sets) ─────────────────────────────
  const destinations = [
    {
      nameVi: 'Đồng Văn', nameEn: 'Dong Van', slug: 'dong-van', province: 'Hà Giang',
      description: 'Trái tim của cao nguyên đá, nơi lưu giữ những giá trị địa chất và văn hoá H\'Mông đặc sắc nhất.',
      coverImage: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=1200',
      altitude: 1600, bestSeason: 'Tháng 10 - Tháng 4', difficulty: 'MODERATE' as const, featured: true
    },
    {
      nameVi: 'Sapa', nameEn: 'Sapa', slug: 'sapa', province: 'Lào Cai',
      description: 'Thị trấn trong mây, nổi tiếng với đỉnh Fansipan và những thửa ruộng bậc thang kỳ vĩ.',
      coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
      altitude: 1600, bestSeason: 'Tháng 9 - Tháng 11', difficulty: 'MODERATE' as const, featured: true
    },
    {
      nameVi: 'Mộc Châu', nameEn: 'Moc Chau', slug: 'moc-chau', province: 'Sơn La',
      description: 'Cao nguyên xanh mướt với những đồi chè trái tim và thung lũng hoa mận trắng muốt.',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      altitude: 1050, bestSeason: 'Tháng 1 - Tháng 3', difficulty: 'EASY' as const, featured: true
    },
    {
      nameVi: 'Mù Cang Chải', nameEn: 'Mu Cang Chai', slug: 'mu-cang-chai', province: 'Yên Bái',
      description: 'Vương quốc của những thửa ruộng bậc thang đẹp nhất thế giới, đặc biệt là vào mùa lúa chín.',
      coverImage: 'https://images.unsplash.com/photo-1596395819057-e37f55a8516b?w=1200',
      altitude: 1000, bestSeason: 'Tháng 9 - Tháng 10', difficulty: 'MODERATE' as const, featured: true
    },
    {
      nameVi: 'Bắc Hà', nameEn: 'Bac Ha', slug: 'bac-ha', province: 'Lào Cai',
      description: 'Nổi tiếng với chợ phiên rực rỡ sắc màu và đặc sản rượu ngô bản phố nấu từ men lá.',
      coverImage: 'https://images.unsplash.com/photo-1581347065842-1277a0642f4c?w=1200',
      altitude: 900, bestSeason: 'Quanh năm (chủ nhật)', difficulty: 'EASY' as const, featured: false
    },
    {
      nameVi: 'Mai Châu', nameEn: 'Mai Chau', slug: 'mai-chau', province: 'Hoà Bình',
      description: 'Thung lũng yên bình của người Thái trắng, nơi có những nếp nhà sàn cổ kính và điệu múa xòe.',
      coverImage: 'https://images.unsplash.com/photo-1620850257833-28669e46f663?w=1200',
      altitude: 800, bestSeason: 'Tháng 3 - Tháng 5', difficulty: 'EASY' as const, featured: true
    },
    {
      nameVi: 'Y Tý', nameEn: 'Y Ty', slug: 'y-ty', province: 'Lào Cai',
      description: 'Vùng đất của những đám mây, nơi người Hà Nhì sinh sống trong những ngôi nhà trình tường hình nấm.',
      coverImage: 'https://images.unsplash.com/photo-1518119024040-0259b380590a?w=1200',
      altitude: 2000, bestSeason: 'Tháng 8 - Tháng 4', difficulty: 'HARD' as const, featured: false
    },
    {
      nameVi: 'Pù Luông', nameEn: 'Pu Luong', slug: 'pu-luong', province: 'Thanh Hoá',
      description: 'Khu bảo tồn thiên nhiên với vẻ đẹp hoang sơ, rừng rậm và những guồng nước đặc trưng.',
      coverImage: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200',
      altitude: 1700, bestSeason: 'Tháng 5 - Tháng 10', difficulty: 'MODERATE' as const, featured: false
    },
    {
      nameVi: 'Cao Bằng', nameEn: 'Cao Bang', slug: 'cao-bang', province: 'Cao Bằng',
      description: 'Nơi có thác Bản Giốc hùng vĩ và Công viên địa chất toàn cầu Non nước Cao Bằng.',
      coverImage: 'https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?w=1200',
      altitude: 800, bestSeason: 'Tháng 8 - Tháng 11', difficulty: 'MODERATE' as const, featured: true
    },
    {
      nameVi: 'Ba Bể', nameEn: 'Ba Be', slug: 'ba-be', province: 'Bắc Kạn',
      description: 'Viên ngọc bích giữa đại ngàn với hồ nước ngọt lớn nhất Việt Nam nằm trên núi đá vôi.',
      coverImage: 'https://images.unsplash.com/photo-1608149814421-2743a6d97c3f?w=1200',
      altitude: 150, bestSeason: 'Tháng 4 - Tháng 9', difficulty: 'EASY' as const, featured: false
    }
  ];

  for (const d of destinations) {
    await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {},
      create: { ...d, images: JSON.stringify([d.coverImage]) },
    });
  }
  console.log(`✅ ${destinations.length} destinations created`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
