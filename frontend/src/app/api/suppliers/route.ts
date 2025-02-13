import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const backendApiUrl = 'http://localhost:3001/getLieferanten';

        // Fetch-Anfrage mit deaktiviertem Cache
        const response = await fetch(backendApiUrl, {
            method: 'GET',
            cache: 'no-store', // Verhindert Fetch-Caching
            headers: {
                'Cache-Control': 'no-store', // Weist Backend an, keine Zwischenspeicherung zu verwenden
            },
        });

        // Überprüfen, ob die Anfrage erfolgreich war
        if (!response.ok) {
            throw new Error(`Backend API Error: ${response.status}`);
        }

        //Ausgeklammerte Logs waren für Prüfung der Doppelausführung durch UseEffect von React ~Richard
        //console.log("Frontend: Anfrage an Backend wird gesendet.");
        const data = await response.json();
        //console.log("Erhaltene Lieferanten: ", data);

        // Daten ohne Caching zurückgeben
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, must-revalidate', // Verhindert Caching im Browser oder bei Proxies
                Pragma: 'no-cache',
                Expires: '0',
            },
        });
    } catch (error: any) {
        console.error('Error in API route:', error);

        // Fehlerantwort ohne Caching
        return NextResponse.json(
            { error: error.message },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, must-revalidate',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
            }
        );
    }
}
