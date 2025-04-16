import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function POST(req: NextRequest) {
  try {
    const backendApiUrl =
      "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/getMaterialDetails"; // Dein geschützter AWS-Endpoint

    const { materialId } = await req.json();

    if (!materialId) {
      throw new Error("materialId is required");
    }

    // ✅ Access Token holen – wichtig: Auth0 muss dafür richtig konfiguriert sein
    const tokenRes = await getAccessToken();
    const token = tokenRes.accessToken;

    if (!token) {
      throw new Error("Kein gültiger Auth0-Token verfügbar");
    }

    // ✅ Request mit Auth Header an AWS API Gateway schicken
    const response = await fetch(backendApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ materialId }),
    });

    if (!response.ok) {
      throw new Error(`Backend API Error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error: any) {
    console.error("Error in API route materialDetails:", error);
    return NextResponse.json(
      { message: "Ein Fehler ist aufgetreten", error: error.message },
      { status: 500 }
    );
  }
}
