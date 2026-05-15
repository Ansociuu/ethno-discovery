import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  let config = {};

  if (location === "sapa") {
    config = {
      default: {
        firstScene: "sapa",
        sceneFadeDuration: 1000,
        autoLoad: true,
      },
      scenes: {
        sapa: {
          title: "Thung lũng Sapa",
          hfov: 110,
          pitch: 0,
          yaw: 0,
          hotSpotDebug: true,
          type: "equirectangular",
          panorama: "/vr/sapa.png",
          autoLoad: true,
          hotSpots: [
            // Thay tọa độ ở đây sau khi bạn tải ảnh Sapa về và đo bằng F12
            {
              pitch: 0,
              yaw: 0,
              type: "info",
              text: "Điểm ví dụ (Cần thay đổi tọa độ)"
            }
          ]
        }
      }
    };
  } else if (location === "fansipan") {
    config = {
      default: {
        firstScene: "fansipan",
        sceneFadeDuration: 1000,
        autoLoad: true,
      },
      scenes: {
        fansipan: {
          title: "Đỉnh Fansipan - Nóc nhà Đông Dương",
          hfov: 110,
          pitch: 0,
          yaw: 0,
          hotSpotDebug: true,
          type: "equirectangular",
          panorama: "/vr/fansipan.png",
          autoLoad: true,
          hotSpots: [
            // Thay tọa độ ở đây sau khi bạn tải ảnh Fansipan về và đo bằng F12
            {
              pitch: 0,
              yaw: 0,
              type: "info",
              text: "Điểm ví dụ (Cần thay đổi tọa độ)"
            }
          ]
        }
      }
    };
  } else {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  // Return with CORS headers so cdn.pannellum.org can read it
  return NextResponse.json(config, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
