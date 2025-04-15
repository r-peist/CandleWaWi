// app/api/inventarkorrektur/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/handlerGetInvKorr");
        if (!res.ok) {
            throw new Error("Fehler beim Abrufen der Inventarkorrektur-Daten");
        }
        const backendData = await res.json();
        
        const data = backendData.data;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
