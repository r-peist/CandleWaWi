import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId, comment } = body;

        // Formatierung des Datums in "YYYY-MM-DD HH:MM:SS"
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

        // Erstelle das Payload im Format, das der Lambda-Handler (handlerInvKorrWE) erwartet.
        const payload = {
            InvKorrWE: {
                Kommentar: comment,
                Datum: formattedDate,
                Benutzer: "default", // ggf. aus der Session übernehmen
                BestellID: orderId,
            },
        };

        // Achte darauf, dass die URL keinen zusätzlichen Leerraum enthält!
        const backendResponse = await fetch('https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/validatedInvKorrWE', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await backendResponse.json();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
