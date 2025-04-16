import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const backendApiUrl =
            "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/handlerGetRezept";

        const token = process.env.AUTH0_API_ACCESS_TOKEN;
        if (!token) {
            throw new Error("Access Token nicht gefunden. Bitte ENV prüfen.");
        }

        const response = await fetch(backendApiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-store",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Fehler beim Abrufen der Rezept-Daten: ${response.status}`
            );
        }

        const result = await response.json();

        if (!result.data || !result.data.Rezept) {
            throw new Error("Rezeptdaten fehlen oder sind ungültig.");
        }

        const rezept = result.data.Rezept;

        const transformedZP = (rezept.ZP || []).map((recipe: any) => ({
            ...recipe,
            Erstellungsdatum: recipe.Releasedate,
            Aenderungsdatum: recipe.Changedate,
        }));

        const transformed = {
            Kerze: rezept.Kerze || [],
            SprayDiff: rezept.SprayDiff || [],
            ZP: transformedZP,
        };

        return NextResponse.json(transformed, {
            headers: {
                "Cache-Control": "no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
            },
        });
    } catch (error: any) {
        console.error("Fehler in der API-Route Rezept GET:", error);
        return NextResponse.json(
            { message: "Ein Fehler ist aufgetreten.", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Hier nutzt du weiterhin den lokalen Express-Endpunkt.
        const backendApiUrl = "http://localhost:3001/validateUpsertRezept";

        const response = await fetch(backendApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(
                `Fehler beim Aktualisieren bzw. Anlegen des Rezepts: ${response.status}`
            );
        }

        const result = await response.json();

        return NextResponse.json(result, {
            headers: {
                "Cache-Control": "no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
            },
        });
    } catch (error: any) {
        console.error("Fehler in der API-Route Rezept POST:", error);
        return NextResponse.json(
            { message: "Ein Fehler ist aufgetreten.", error: error.message },
            { status: 500 }
        );
    }
}
