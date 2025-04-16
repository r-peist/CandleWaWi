import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0/edge";

export async function GET(req: NextRequest) {
  try {
    const { accessToken } = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json({ message: "Nicht eingeloggt" }, { status: 401 });
    }

    const backendApiUrl = "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/handlerInventar";

    const response = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-store",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Inventar-Daten: ${response.status}`);
    }

    const result = await response.json();

    const inventar =
      (result?.response?.data?.Inventar && Array.isArray(result.response.data.Inventar)
        ? result.response.data.Inventar
        : result?.data?.Inventar) || null;

    if (!inventar || !Array.isArray(inventar)) {
      throw new Error("Inventar-Daten fehlen oder haben das falsche Format");
    }

    return NextResponse.json(inventar, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    console.error("Fehler in der API-Route Inventar:", error);
    return NextResponse.json(
      { message: "Ein Fehler ist aufgetreten.", error: error.message },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}
