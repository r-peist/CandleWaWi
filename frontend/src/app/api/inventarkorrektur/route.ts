// app/api/inventarkorrektur/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Hole die Daten vom Backend (hier wird der Endpunkt handlerGetInvKorr angesprochen)
        const res = await fetch("http://localhost:3001/handlerGetInvKorr");
        if (!res.ok) {
            throw new Error("Fehler beim Abrufen der Inventarkorrektur-Daten");
        }
        const backendData = await res.json();
        // Erwartete Backend-Struktur:
        // {
        //   "message": "...",
        //   "data": { Inventarkorrektur: { InvKorrMats: [...], InvKorrBest: [...] } },
        //   "response": { ... }
        // }
        // Wir liefern hier den "data"-Teil an das Frontend
        const data = backendData.data;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
