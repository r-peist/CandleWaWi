// /api/suppliers.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const backendApiUrl = "http://localhost:3001/getLieferanten";

        const response = await fetch(backendApiUrl, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Cache-Control": "no-store",
            },
        });

        if (!response.ok) {
            throw new Error(`Backend API Error: ${response.status}`);
        }

        const data = await response.json();
        // Extrahiere zuerst data.response.data.Lieferanten, ansonsten versuche data.response.Lieferanten oder data.Lieferanten
        const lieferanten =
            data.response?.data?.Lieferanten ?? data.response?.Lieferanten ?? data.Lieferanten ?? [];

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
