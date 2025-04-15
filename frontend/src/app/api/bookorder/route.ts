import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId } = body;

        // Bereite das Payload im Format vor, das der Lambda-Handler (handlerBuchung) erwartet
        const payload = {
            Buchung: {
                BestellID: orderId
            }
        };

        // Sende den Request an das Backend (Lambda)
        const backendResponse = await fetch('https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/validatedBuchung', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await backendResponse.json();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
