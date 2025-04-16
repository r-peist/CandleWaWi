import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderId } = body;

        const payload = {
            Buchung: {
                BestellID: orderId,
            },
        };

        // 🔐 Auth0 Access Token abrufen
        const { accessToken } = await getAccessToken();
        if (!accessToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const backendResponse = await fetch('https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/validatedBuchung', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // 🔒 Auth hinzufügen
            },
            body: JSON.stringify(payload),
        });

        if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            throw new Error(`Fehler vom Backend (${backendResponse.status}): ${errorText}`);
        }

        const result = await backendResponse.json();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("[Buchung API-Fehler]:", error.message);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
