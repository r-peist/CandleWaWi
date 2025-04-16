import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function POST(req: NextRequest) {
    try {
        const backendApiUrl = "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/validatedGetMatLief";

        // 🔐 Auth0 Access Token holen
        const { accessToken } = await getAccessToken();
        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Request-Body lesen
        const body = await req.json();
        console.log("Frontend: Bestellung wird an das Backend gesendet...", body);

        // Füge "Benutzer" mit Standardwert "default" hinzu, falls es fehlt
        if (body?.Bestellung && !body.Bestellung.Benutzer) {
            body.Bestellung.Benutzer = "default";
        }

        // Anfrage an das Backend mit Auth-Header senden
        const response = await fetch(backendApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "Cache-Control": "no-store",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Fehler beim Senden der Bestellung: ${response.status} – ${errorText}`);
        }

        const result = await response.json();
        const bestellungData = result?.response?.data ?? result?.data ?? {};

        return NextResponse.json(
            {
                message: "Bestellung erfolgreich gesendet",
                data: bestellungData,
            },
            {
                headers: {
                    "Cache-Control": "no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            }
        );
    } catch (error: any) {
        console.error("Fehler in der API-Route für Bestellung:", error.message);
        return NextResponse.json(
            { message: "Ein Fehler ist aufgetreten.", error: error.message },
            {
                status: 500,
                headers: {
                    "Cache-Control": "no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            }
        );
    }
}
