// /api/bestellung.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const backendApiUrl = "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/validatedGetMatLief";

        // Lese den Request-Body
        const body = await req.json();
        console.log("Frontend: Bestellung wird an das Backend gesendet...", body);

        // Füge "Benutzer" mit Standardwert "default" hinzu, falls es nicht existiert
        if (body?.Bestellung && !body.Bestellung.Benutzer) {
            body.Bestellung.Benutzer = "default";
        }

        // Sende den Request an den Backend-Endpoint
        const response = await fetch(backendApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Senden der Bestellung: ${response.status}`);
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
        console.error("Fehler in der API-Route für Bestellung:", error);
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
