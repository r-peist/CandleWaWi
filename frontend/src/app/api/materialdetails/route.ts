import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const backendApiUrl = 'http://localhost:3001/getMaterialDetails';
        const requestBody = await req.json();

        if (!requestBody.materialId) {
            throw new Error('materialId is required');
        }

        // Auf die interne API zugreifen
        const response = await fetch(backendApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ materialId: requestBody.materialId }),
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