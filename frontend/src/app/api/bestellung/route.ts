import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const backendApiUrl = "http://localhost:3001/getBestellung"; // Backend-Endpoint
        const body = await req.json();

        console.log("Frontend: Bestellung wird an das Backend gesendet...", body);

        const response = await fetch(backendApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Senden der Bestellung: ${response.status}`);
        }

        const data = await response.json();
        console.log("Frontend: Bestellung erfolgreich verarbeitet", data);

        return NextResponse.json(data, {
            headers: {
                "Cache-Control": "no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
            },
        });
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
