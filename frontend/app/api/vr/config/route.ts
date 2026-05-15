import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  let config = {};

  if (location === "atacama") {
    config = {
      default: {
        firstScene: "atacama",
        sceneFadeDuration: 1000,
        autoLoad: true,
      },
      scenes: {
        atacama: {
          title: "Thung lũng Atacama (Chile) - Đài thiên văn ALMA",
          hfov: 110,
          pitch: 0,
          yaw: 0,
          hotSpotDebug: true,
          type: "equirectangular",
          panorama: "https://pannellum.org/images/alma.jpg",
          autoLoad: true,
          hotSpots: [
            {
              pitch: 2.1,
              yaw: -17.5,
              type: "info",
              text: "Đài thiên văn vô tuyến ALMA"
            },
            {
              pitch: 3.5,
              yaw: 161.4,
              type: "info",
              text: "Đỉnh núi Andes"
            },
            {
              pitch: -7.5,
              yaw: 15.6,
              type: "info",
              text: "Hoang mạc Atacama"
            }
          ]
        }
      }
    };
  } else if (location === "cerrotoco") {
    config = {
      default: {
        firstScene: "cerrotoco",
        sceneFadeDuration: 1000,
        autoLoad: true,
      },
      scenes: {
        cerrotoco: {
          title: "Đỉnh Cerro Toco - 5,604m (Chile)",
          hfov: 110,
          pitch: 0,
          yaw: 0,
          hotSpotDebug: true,
          type: "equirectangular",
          panorama: "https://pannellum.org/images/cerro-toco-0.jpg",
          autoLoad: true,
          hotSpots: [
            {
              pitch: 1.5,
              yaw: -176.5,
              type: "info",
              text: "Hành trình Trekking độ cao 5,000m"
            },
            {
              pitch: -5.5,
              yaw: 89.0,
              type: "info",
              text: "Tầm nhìn bao quát Sa mạc"
            },
            {
              pitch: -18.0,
              yaw: -5.0,
              type: "info",
              text: "Địa hình núi đá núi lửa"
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
