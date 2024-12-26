import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const backendApiUrl = 'http://localhost:3001/getLieferanten';

        // Auf die interne API zugreifen
        const response = await fetch(backendApiUrl
        //Von Richard geändert, Body wird nicht benötigt bei einem Trigger, unerklärlicher fehler daraus resultiert...
            , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Backend-Antwort als JSON zurückgeben
        if (!response.ok) {
            throw new Error(`Backend API Error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
