import { NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function GET() {
  try {
    const backendUrl =
      "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/handlerGetInvKorr";

    // Auth0 Access Token holen
    const { accessToken } = await getAccessToken();
    if (!accessToken) {
      throw new Error("Kein gültiger Access Token vorhanden.");
    }

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-store",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Fehler beim Abrufen der Inventarkorrektur-Daten (Status: ${res.status})`
      );
    }

    const backendData = await res.json();
    const data = backendData?.data ?? [];

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: any) {
    console.error("❌ Fehler in /api/inventarkorrektur:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
