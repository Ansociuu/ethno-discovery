import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/tours/${params.id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const data = await res.json();
    const tour = data.data;

    if (!tour) return { title: 'Không tìm thấy Tour | EthnoDiscovery' };

    return {
      title: `${tour.title} | EthnoDiscovery`,
      description: tour.description?.substring(0, 160) || `Khám phá tour ${tour.title} cùng EthnoDiscovery`,
      openGraph: {
        title: `${tour.title} | EthnoDiscovery`,
        description: tour.description?.substring(0, 160),
        images: tour.coverImage ? [{ url: tour.coverImage }] : [],
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: 'Chi tiết Tour | EthnoDiscovery',
    };
  }
}

export default function TourDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
