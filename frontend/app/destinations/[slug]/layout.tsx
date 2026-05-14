import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/destinations/${params.slug}`, {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    const dest = data.data;

    if (!dest) return { title: 'Không tìm thấy Điểm đến | EthnoDiscovery' };

    return {
      title: `Khám phá ${dest.nameVi} | EthnoDiscovery`,
      description: dest.description?.substring(0, 160) || `Hành trình khám phá văn hóa tại ${dest.nameVi}`,
      openGraph: {
        title: `Khám phá ${dest.nameVi} | EthnoDiscovery`,
        description: dest.description?.substring(0, 160),
        images: dest.coverImage ? [{ url: dest.coverImage }] : [],
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: 'Chi tiết Điểm đến | EthnoDiscovery',
    };
  }
}

export default function DestinationDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
