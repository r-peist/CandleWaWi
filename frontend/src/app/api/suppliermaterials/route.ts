// /api/suppliermaterials.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Verwende den korrekten Backend-Endpoint, der valide Daten liefert:
        const backendApiUrl = "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/validatedGetLieferantFE";

        // Lese den Request-Body
        const requestBody = await req.json();
        console.log("Empfangen wurde:", requestBody);

        // Ermittele die LiefID: entweder direkt oder innerhalb des Objekts "Lieferant"
        const liefId = requestBody.LiefID || requestBody.Lieferant?.LiefID;
        if (!liefId) {
            throw new Error("LiefID is required");
        }

        // Erstelle das Payload im Format, welches das Backend erwartet:
        // { "Lieferant": { "LiefID": <liefId> } }
        const payload = { Lieferant: { LiefID: liefId } };

        // Sende den POST-Request an den Backend-Endpoint
        const response = await fetch(backendApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Backend API Error: ${response.status}`);
        }

        const result = await response.json();
        // Extrahiere die Materialdaten. Das Backend liefert die Daten typischerweise entweder
        // unter result.response.data.MatLiefs oder unter result.data.MatLiefs.
        const matLiefs =
            result?.response?.data?.MatLiefs ?? result?.data?.MatLiefs ?? [];

        return NextResponse.json(
            {
                message: "Materialien erfolgreich abgerufen",
                data: matLiefs,
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
        console.error("Error in API route suppliermaterials:", error);
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
