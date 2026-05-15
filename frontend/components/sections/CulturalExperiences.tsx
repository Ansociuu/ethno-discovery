"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

const EXPERIENCES = [
  { icon: "🏪", name: "Chợ Phiên Vùng Cao", desc: "Phiên chợ bản sắc H'Mông & Dao mỗi cuối tuần, nơi giao lưu văn hoá độc đáo", tag: "Văn hoá", gradient: "linear-gradient(160deg, var(--bg3), var(--pink))", image: "/images/cultural-market.png" },
  { icon: "🎨", name: "Lễ Cấp Sắc Người Dao", desc: "Trải nghiệm nghi lễ trưởng thành linh thiêng và huyền bí của người Dao Đỏ", tag: "Nghi lễ", gradient: "linear-gradient(160deg, var(--dark), var(--amber))", image: "/images/cultural-ceremony.png" },
  { icon: "🧵", name: "Thêu Thừa Dao Đỏ", desc: "Học nghệ thuật thêu hoa văn tinh xảo trên trang phục truyền thống của người Dao", tag: "Thủ công", gradient: "linear-gradient(160deg, var(--midnight), var(--pink))", image: "/images/cultural-embroidery.png" },
  { icon: "🎵", name: "Tiếng Khèn H'Mông", desc: "Nghe tiếng khèn gọi bạn tình dưới trăng bên bếp lửa — linh hồn của núi rừng", tag: "Âm nhạc", gradient: "linear-gradient(160deg, var(--bg3), var(--amber))", image: "/images/cultural-hmong.png" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export function CulturalExperiences() {
  return (
    <section className="bg-midnight py-24 m-0 max-w-full overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div>
            <span className="section-tag">🌺 Trải Nghiệm Văn Hoá</span>
            <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-bold leading-[1.1] my-4">
              Chạm Đến <span className="text-gradient-pink">Bản Sắc</span>
            </h2>
            <p className="text-text text-[17px] font-light max-w-[500px] leading-relaxed">
              Không chỉ ngắm nhìn — mà thực sự sống trong văn hoá H&apos;Mông và Dao qua những hoạt động tay nghề độc đáo.
            </p>
          </div>
        </motion.div>

        {/* Content Layout: 1 Large Image Feature + Grid of Experiences */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Feature Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="lg:col-span-5 relative rounded-3xl overflow-hidden min-h-[400px] lg:min-h-full group"
          >
            <Image
              src="/images/cultural-hmong.png"
              alt="Hmong Cultural Experience"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <span className="badge badge-pink mb-4">Nổi bật</span>
              <h3 className="font-serif text-3xl font-bold text-white mb-2">Vẻ Đẹp Sapa</h3>
              <p className="text-white/70 text-sm max-w-sm">
                Đắm chìm vào không gian văn hoá bản địa chân thực nhất với trang phục truyền thống đầy màu sắc.
              </p>
            </div>
          </motion.div>

          {/* Grid of Experiences */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {EXPERIENCES.map((exp, i) => (
              <motion.div
                key={exp.name}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="relative rounded-3xl overflow-hidden min-h-[250px] cursor-pointer shadow-lg shadow-black/20 group hover:shadow-xl hover:shadow-pink/10 transition-shadow duration-300"
                style={{ background: exp.gradient }}
              >
                {/* Image Background */}
                {exp.image && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={exp.image}
                      alt={exp.name}
                      fill
                      className="object-cover mix-blend-overlay opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                    />
                  </div>
                )}

                {/* Overlay highlight */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-midnight/90 via-midnight/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                
                {/* Moving gradient noise for luxury feel */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:4px_4px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                {/* Icon */}
                <div className="absolute top-5 left-5 z-10 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/10 group-hover:scale-110 transition-transform">
                  {exp.icon}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3 className="font-serif text-[19px] font-bold mb-2 text-white group-hover:text-amber transition-colors">
                    {exp.name}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-2">
                    {exp.desc}
                  </p>
                  <span className="badge badge-amber text-[11px]">{exp.tag}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
