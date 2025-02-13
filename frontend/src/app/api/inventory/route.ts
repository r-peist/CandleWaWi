// /api/inventar.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const backendApiUrl = "http://localhost:3001/handlerInventar"; // Backend-Endpoint
        console.log("Frontend: Anfrage an Backend wird gesendet...");

        const response = await fetch(backendApiUrl, {
            method: "GET",
            headers: {
                "Cache-Control": "no-store",
            },
            // Erzwingt, dass immer eine frische Antwort abgerufen wird
            next: { revalidate: 0 },
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Inventar-Daten: ${response.status}`);
        }

        const data = await response.json();
        console.log("Frontend: Daten erfolgreich erhalten:", data);

        // Extrahiere das Inventar-Array aus dem verschachtelten Objekt
        // Vorher: data?.response?.sendInventar?.inventar
        // Neu: data?.response?.data?.Inventar
        const inventar = data?.response?.data?.Inventar;

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
