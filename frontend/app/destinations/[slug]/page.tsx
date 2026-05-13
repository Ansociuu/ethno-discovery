"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { MapPin, Mountain, Calendar, ChevronRight, Star, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { destinationsApi } from "@/lib/api";

export default function DestinationDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["destination", slug],
    queryFn: () => destinationsApi.getBySlug(slug).then(r => r.data.data),
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: 70, minHeight: "100vh" }}>
          <div className="skeleton" style={{ height: 500 }} />
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px" }}>
            <div className="skeleton" style={{ height: 40, width: "60%", marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 20, width: "40%", marginBottom: 40 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
              {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 20 }} />)}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isError || !data) return null;

  const dest = data;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 70 }}>
        {/* Hero Banner */}
        <div style={{ position: "relative", height: 500, overflow: "hidden" }}>
          {dest.coverImage
            ? <img src={dest.coverImage} alt={dest.nameVi} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--midnight), var(--pink))" }} />
          }
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,13,31,1) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }} />
          <div style={{ position: "absolute", bottom: 48, left: 0, right: 0, maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Trang chủ</Link>
              <ChevronRight size={14} />
              <Link href="/destinations" style={{ color: "inherit", textDecoration: "none" }}>Điểm đến</Link>
              <ChevronRight size={14} />
              <span style={{ color: "#fff" }}>{dest.nameVi}</span>
            </div>

            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 900, marginBottom: 12, lineHeight: 1.1 }}>
              {dest.nameVi}
            </h1>
            <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 15 }}>
                <MapPin size={16} style={{ color: "var(--pink)" }} /> {dest.province}
              </span>
              {dest.altitude && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 15 }}>
                  <Mountain size={16} style={{ color: "var(--amber)" }} /> {dest.altitude.toLocaleString()}m
                </span>
              )}
              {dest.bestSeason && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 15 }}>
                  <Calendar size={16} style={{ color: "var(--pink)" }} /> {dest.bestSeason}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 40px" }}>
          {/* Description */}
          {dest.descriptionVi && (
            <div style={{ maxWidth: 800, marginBottom: 60 }}>
              <p style={{ fontSize: 17, color: "var(--text)", lineHeight: 1.8 }}>{dest.descriptionVi}</p>
            </div>
          )}

          {/* Tours */}
          {dest.tours?.length > 0 && (
            <div style={{ marginBottom: 60 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 700 }}>
                  Tours tại <span className="text-gradient-pink">{dest.nameVi}</span>
                </h2>
                <Link href={`/tours?destinationId=${dest.id}`} className="btn-ghost" style={{ padding: "10px 20px", fontSize: 14 }}>
                  Xem tất cả <ChevronRight size={16} />
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {dest.tours.map((tour: any) => (
                  <Link key={tour.id} href={`/tours/${tour.id}`} style={{ textDecoration: "none" }}>
                    <div className="card"
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
                      {tour.coverImage && (
                        <div style={{ height: 160, overflow: "hidden" }}>
                          <img src={tour.coverImage} alt={tour.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <div style={{ padding: 16 }}>
                        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#fff", lineHeight: 1.3 }}>{tour.title}</h3>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, color: "var(--text)" }}>{tour.durationDays} ngày</span>
                          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--amber)" }}>
                            {Number(tour.pricePerPerson).toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Homestays */}
          {dest.homestays?.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 700 }}>
                  Homestay tại <span className="text-gradient-amber">{dest.nameVi}</span>
                </h2>
                <Link href={`/homestays?destinationId=${dest.id}`} className="btn-ghost" style={{ padding: "10px 20px", fontSize: 14 }}>
                  Xem tất cả <ChevronRight size={16} />
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {dest.homestays.map((hs: any) => (
                  <Link key={hs.id} href={`/homestays/${hs.id}`} style={{ textDecoration: "none" }}>
                    <div className="card"
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
                      {hs.coverImage && (
                        <div style={{ height: 160, overflow: "hidden" }}>
                          <img src={hs.coverImage} alt={hs.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                      )}
                      <div style={{ padding: 16 }}>
                        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#fff", lineHeight: 1.3 }}>{hs.name}</h3>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--text)" }}>
                            <Users size={13} /> {hs.maxGuests} khách
                          </span>
                          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--amber)" }}>
                            {Number(hs.pricePerNight).toLocaleString("vi-VN")}₫/đêm
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
