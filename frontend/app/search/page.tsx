import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = {
  title: "Tìm Kiếm | EthnoDiscovery",
  description: "Tìm kiếm tours, homestay và điểm đến vùng cao Tây Bắc Việt Nam",
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main style={{ paddingTop: 70, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Đang tải...</p>
          </div>
        </main>
      </>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
