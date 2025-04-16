import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const backendApiUrl =
      "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/handlerWareneingang";

    console.log("[API] Anfrage an Backend wird gesendet...");

    // 🔐 Auth0-Access-Token abrufen
    const { accessToken } = await getAccessToken();
    if (!accessToken) {
      throw new Error("Kein gültiger Access Token vorhanden.");
    }

    // 🛰️ Request an AWS API Gateway senden
    const response = await fetch(backendApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-store",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der Wareneingang-Daten: ${response.status}`);
    }

    const result = await response.json();

    if (!result?.data?.Wareneingang) {
      throw new Error("Wareneingangsdaten fehlen oder sind ungültig.");
    }

    return NextResponse.json(result.data.Wareneingang, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: any) {
    console.error("[API-Fehler]:", error.message);
    return NextResponse.json(
      { message: "Ein Fehler ist aufgetreten.", error: error.message },
      { status: 500 }
    );
  }
}
