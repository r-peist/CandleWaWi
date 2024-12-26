import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const backendApiUrl = "http://localhost:3001/getLieferantenFE";
        const requestBody = await req.json();
        console.log("Empfangen wurde: ", requestBody);

        if (!requestBody.LiefID) {
            throw new Error("LiefID is required");
        }

        const response = await fetch(backendApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store", // Verhindert Caching auf Fetch-Ebene
            },
            body: JSON.stringify({ LiefID: requestBody.LiefID }),
            cache: "no-store", // Zusätzliche Fetch-Option
        });

        if (!response.ok) {
            throw new Error(`Backend API Error: ${response.status}`);
        }

        const data = await response.json();

        // Extrahiere nur die relevanten Daten aus der Backend-Antwort
        return NextResponse.json(
            {
                message: "Materialien erfolgreich abgerufen",
                data: data.data, // Übergebe das `data`-Array an das Frontend
            },
            {
                headers: {
                    "Cache-Control": "no-store, must-revalidate", // Verhindert Browser-Caching
                    Pragma: "no-cache", // Für ältere Browser
                    Expires: "0", // Setzt ein sofortiges Ablaufdatum
                },
            }
        );
    } catch (error: any) {
        console.error("Error in API route:", error);

        return NextResponse.json(
            { message: "Ein Fehler ist aufgetreten.", error: error.message },
            {
                status: 500,
                headers: {
                    "Cache-Control": "no-store, must-revalidate", // Verhindert Browser-Caching bei Fehlern
                    Pragma: "no-cache",
                    Expires: "0",
                },
            }
        );
    }
}
