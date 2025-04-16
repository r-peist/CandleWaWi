// /api/suppliers.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const backendApiUrl = "https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/getLieferanten";

        // ⛳ Access Token – entweder speichern oder zur Laufzeit holen
        const token = process.env.AUTH0_API_ACCESS_TOKEN; // Stell sicher, dass dieses Token im .env vorhanden ist!

        if (!token) {
            throw new Error("Access Token nicht gefunden");
        }

        const response = await fetch(backendApiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-store",
            },
        });

        if (!response.ok) {
            throw new Error(`Backend API Error: ${response.status}`);
        }

        const data = await response.json();

        const lieferanten =
            data?.data?.Lieferanten ?? data?.Lieferanten ?? [];

        return NextResponse.json(
            { Lieferanten: lieferanten },
            {
                headers: {
                    "Cache-Control": "no-store, must-revalidate",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            }
        );
    } catch (error: any) {
        console.error("Error in API route suppliers:", error);
        return NextResponse.json(
            { error: error.message },
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
