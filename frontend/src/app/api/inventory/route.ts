import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function GET(req: NextRequest) {
  try {
    const backendApiUrl =
      "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/handlerInventar";

    // 🔐 Auth0 Access Token holen
    const tokenRes = await getAccessToken();
    const token = tokenRes.accessToken;

    if (!token) {
      throw new Error("Kein gültiger Auth0-Token verfügbar.");
    }

    console.log("Frontend: Anfrage mit Auth Header wird an Backend gesendet...");

    const response = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Inventar-Daten: ${response.status}`);
    }

    const data = await response.json();
    console.log("Frontend: Daten erfolgreich erhalten:", data);

    const inventar =
      (data?.response?.data?.Inventar && Array.isArray(data.response.data.Inventar)
        ? data.response.data.Inventar
        : data?.data?.Inventar) || null;

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
