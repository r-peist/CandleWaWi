import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const backendApiUrl = "http://localhost:3001/handlerWareneingang"; // Backend-URL

        console.log("Frontend: Anfrage an Backend Wareneingang wird gesendet...");

        const response = await fetch(backendApiUrl, {
            method: "GET",
            headers: {
                "Cache-Control": "no-store",
            },
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Wareneingang-Daten: ${response.status}`);
        }

        const data = await response.json();

        // Prüfen, ob die Wareneingangsdaten vorhanden sind
        if (!data.Wareneingang) {
            throw new Error("Wareneingangsdaten fehlen oder sind ungültig.");
        }

        return NextResponse.json(data.Wareneingang, {
            headers: {
                "Cache-Control": "no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            },
        });
    } catch (error: any) {
        console.error("Fehler in der API-Route Wareneingang:", error);
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
