import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/homestays/${params.id}`, {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    const homestay = data.data;

    if (!homestay) return { title: 'Không tìm thấy Homestay | EthnoDiscovery' };

    return {
      title: `${homestay.name} | EthnoDiscovery`,
      description: homestay.description?.substring(0, 160) || `Lưu trú tại ${homestay.name} cùng EthnoDiscovery`,
      openGraph: {
        title: `${homestay.name} | EthnoDiscovery`,
        description: homestay.description?.substring(0, 160),
        images: homestay.coverImage ? [{ url: homestay.coverImage }] : [],
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: 'Chi tiết Homestay | EthnoDiscovery',
    };
  }
}

export default function HomestayDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
