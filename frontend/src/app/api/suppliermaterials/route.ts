import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const backendApiUrl = 'http://localhost:3001/getLieferantenFE';
        const requestBody = await req.json();

        if (!requestBody.lieferantId) {
            throw new Error('lieferantId is required');
        }

        // Anfrage an das externe Backend senden
        const response = await fetch(backendApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lieferantId: requestBody.lieferantId }),
        });

        if (!response.ok) {
            throw new Error(`Backend API Error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data); // Materialien zurückgeben
    } catch (error: any) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
