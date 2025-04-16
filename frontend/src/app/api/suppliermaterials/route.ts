// /api/suppliermaterials.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const backendApiUrl =
            "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/validatedGetLieferantFE";

        // Access Token aus ENV lesen (du musst ihn vorher in .env.local setzen)
        const token = process.env.AUTH0_API_ACCESS_TOKEN;
        if (!token) {
            throw new Error("Access Token nicht gefunden. Bitte ENV prüfen.");
        }

        // Request Body einlesen
        const requestBody = await req.json();
        const liefId = requestBody.LiefID || requestBody.Lieferant?.LiefID;

        if (!liefId) {
            throw new Error("LiefID ist erforderlich");
        }

        const payload = { Lieferant: { LiefID: liefId } };

        const response = await fetch(backendApiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
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
            { message: "Fehler", error: error.message },
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
