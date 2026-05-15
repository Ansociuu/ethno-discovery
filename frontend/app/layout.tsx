import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "EthnoDiscovery — Du Lịch Văn Hoá Vùng Cao Việt Nam",
  description:
    "Khám phá vẻ đẹp bản địa H'Mông, Dao, Tày tại Hà Giang, Sapa, Mộc Châu. Trải nghiệm homestay, văn hoá và AI Journey Planner độc quyền.",
  keywords: ["du lịch vùng cao", "homestay hà giang", "sapa", "văn hoá hmong", "ethno discovery"],
  openGraph: {
    title: "EthnoDiscovery — Du Lịch Văn Hoá Vùng Cao",
    description: "Nền tảng du lịch văn hoá cao cấp Vùng Cao Việt Nam",
    type: "website",
  },
};

import { CustomerCareWidget } from "@/components/ui/CustomerCareWidget";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${playfair.variable} antialiased`}>
        <Providers>
          {children}
          <CustomerCareWidget />
          <ScrollToTop />
          <Toaster position="top-center" theme="dark" richColors toastOptions={{ style: { background: "var(--midnight)", border: "1px solid var(--glass-border)", color: "#fff" } }} />
        </Providers>
      </body>
    </html>
  );
}
