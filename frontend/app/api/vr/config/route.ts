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
          title: "Thung lũng Sapa - Ruộng Bậc Thang",
          hfov: 110,
          pitch: 10,
          yaw: 180,
          type: "equirectangular",
          panorama: "https://pannellum.org/images/alma.jpg",
          autoLoad: true,
          hotSpots: [
            {
              pitch: 5,
              yaw: 160,
              type: "info",
              text: "Bản Cát Cát - Làng nghề truyền thống"
            },
            {
              pitch: -5,
              yaw: 210,
              type: "info",
              text: "Ruộng bậc thang lúa chín vàng"
            },
            {
              pitch: 15,
              yaw: 100,
              type: "info",
              text: "Homestay View Thung Lũng"
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
          pitch: -10,
          yaw: 50,
          type: "equirectangular",
          panorama: "https://pannellum.org/images/cerro-toco-0.jpg",
          autoLoad: true,
          hotSpots: [
            {
              pitch: 20,
              yaw: 40,
              type: "info",
              text: "Biển mây trên đỉnh Fansipan (3,143m)"
            },
            {
              pitch: -15,
              yaw: 90,
              type: "info",
              text: "Hệ thống cáp treo đạt kỷ lục thế giới"
            },
            {
              pitch: 0,
              yaw: -30,
              type: "info",
              text: "Chùa Trình - Không gian tâm linh"
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
