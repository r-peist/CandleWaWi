import { NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, comment } = body;

    // Format: "YYYY-MM-DD HH:MM:SS"
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

    const payload = {
      InvKorrWE: {
        Kommentar: comment,
        Datum: formattedDate,
        Benutzer: "default", // ❗ Optional: später aus Session holen
        BestellID: orderId,
      },
    };

    // 🔐 Auth0 Access Token holen
    const { accessToken } = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendResponse = await fetch(
      "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/validatedInvKorrWE",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(
        `Fehler vom Backend (${backendResponse.status}): ${errorText}`
      );
    }

    const result = await backendResponse.json();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[API Fehler]:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
