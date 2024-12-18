import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const backendApiUrl = "http://localhost:3001/getLieferantenFE";
        const requestBody = await req.json();

        if (!requestBody.LiefID) {
            throw new Error("LiefID is required");
        }

        const response = await fetch(backendApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ LiefID: requestBody.LiefID }),
        });

        if (!response.ok) {
            throw new Error(`Backend API Error: ${response.status}`);
        }

        const data = await response.json();

        // Extrahiere nur die relevanten Daten aus der Backend-Antwort
        return NextResponse.json({
            message: "Materialien erfolgreich abgerufen",
            data: data.data, // Übergebe das `data`-Array an das Frontend
        });
    } catch (error: any) {
        console.error("Error in API route:", error);

        return NextResponse.json(
            { message: "Ein Fehler ist aufgetreten.", error: error.message },
            { status: 500 }
        );
    }
}
