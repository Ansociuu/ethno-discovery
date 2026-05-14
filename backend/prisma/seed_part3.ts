import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Professional Data Part 3 (Homestays & More Tours)...');

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  const destinations = await prisma.destination.findMany();

  if (!admin || destinations.length < 5) {
    console.error('❌ Run Part 1 first!');
    return;
  }

  // ─── Homestays (20 sets) ───────────────────────────────
  const homestayData = [
    { name: 'H\'Mông Village', dest: 'dong-van', price: 1200000, img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200' },
    { name: 'Lô Lô Chải Homestay', dest: 'dong-van', price: 450000, img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200' },
    { name: 'Sapa Clay House', dest: 'sapa', price: 2500000, img: 'https://images.unsplash.com/photo-1449156001533-cb39c773811c?w=1200' },
    { name: 'Tả Van Family', dest: 'sapa', price: 350000, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200' },
    { name: 'The November Mộc Châu', dest: 'moc-chau', price: 850000, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200' },
    { name: 'Mộc Châu Retreat', dest: 'moc-chau', price: 1500000, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200' },
    { name: 'Mù Cang Chải Ecolodge', dest: 'mu-cang-chai', price: 1800000, img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200' },
    { name: 'Hello Mu Cang Chai', dest: 'mu-cang-chai', price: 400000, img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200' },
    { name: 'Bắc Hà Eco Homestay', dest: 'bac-ha', price: 550000, img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200' },
    { name: 'Mai Châu Hideaway', dest: 'mai-chau', price: 2200000, img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200' },
    { name: 'Little Mai Chau', dest: 'mai-chau', price: 600000, img: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1200' },
    { name: 'Y Ty Clouds', dest: 'y-ty', price: 300000, img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200' },
    { name: 'Pù Luông Retreat', dest: 'pu-luong', price: 2600000, img: 'https://images.unsplash.com/photo-1551882547-ff43c63efe81?w=1200' },
    { name: 'Ciel Pù Luông', dest: 'pu-luong', price: 1400000, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200' },
    { name: 'Jungleman Homestay', dest: 'cao-bang', price: 400000, img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200' },
    { name: 'Primrose Cao Bằng', dest: 'cao-bang', price: 650000, img: 'https://images.unsplash.com/photo-1535827841776-24afc1e255bc?w=1200' },
    { name: 'Ba Be Lake View', dest: 'ba-be', price: 500000, img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200' },
    { name: 'Mr Linh\'s Homestay', dest: 'ba-be', price: 800000, img: 'https://images.unsplash.com/photo-1432333030380-dd7e91460596?w=1200' },
    { name: 'Bản Dốc Resort', dest: 'cao-bang', price: 2800000, img: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200' },
    { name: 'A Chu Homestay', dest: 'moc-chau', price: 900000, img: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=1200' }
  ];

  for (const h of homestayData) {
    const dest = destinations.find(d => d.slug === h.dest);
    if (dest) {
      await prisma.homestay.upsert({
        where: { slug: h.name.toLowerCase().replace(/ /g, '-') },
        update: {},
        create: {
          name: h.name,
          slug: h.name.toLowerCase().replace(/ /g, '-'),
          description: `Trải nghiệm không gian sống bản địa tại ${h.name}, nơi bạn có thể thư giãn và tìm hiểu văn hoá của người dân ${dest.nameVi}.`,
          pricePerNight: h.price,
          maxGuests: 4,
          destinationId: dest.id,
          hostId: admin.id,
          amenities: JSON.stringify(['WiFi', 'Bữa sáng', 'Nước nóng', 'Chỗ để xe']),
          address: `Thôn bản, ${dest.nameVi}, ${dest.province}`,
          coverImage: h.img,
          images: JSON.stringify([h.img]),
          featured: h.price > 1000000
        }
      });
    }
  }
  console.log(`✅ ${homestayData.length} homestays created`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
