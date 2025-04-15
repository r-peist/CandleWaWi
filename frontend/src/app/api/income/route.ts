import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const backendApiUrl = "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/handlerWareneingang";
        console.log("[API] Anfrage an Backend wird gesendet...");

        let response;
        try {
            response = await fetch(backendApiUrl, {
                method: "GET",
                headers: {
                    "Cache-Control": "no-store",
                },
                next: { revalidate: 0 },
            });
        } catch (networkError: any) {
            console.error("[API-Fehler] Backend nicht erreichbar!", networkError.message);
            return NextResponse.json(
                { message: "Backend nicht erreichbar", error: networkError.message },
                { status: 502 }
            );
        }

        if (!response.ok) {
            throw new Error(`Fehler beim Abrufen der Wareneingang-Daten: ${response.status}`);
        }

        let result;
        try {
            result = await response.json();
        } catch (parseError: any) {
            console.error("[API-Fehler] Antwort ist kein gültiges JSON!", parseError.message);
            return NextResponse.json(
                { message: "Ungültige Antwort vom Backend", error: parseError.message },
                { status: 500 }
            );
        }

        if (!result.data || !result.data.Wareneingang) {
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
