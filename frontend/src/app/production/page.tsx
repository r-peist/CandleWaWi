// File: app/production/page.tsx (ProductionOverviewPage)
"use client";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
// Omars Änderungen
import { useUser } from '@auth0/nextjs-auth0/client';

const ProductionOverviewPage = () => {
    const router = useRouter();

    // Omars Änderungen
    const { user, isLoading } = useUser();
    // Omars Änderungen Ende

    const handleNeuentwicklung = () => {
        router.push("/recipes");
    };

    const handleHerstellung = () => {
        router.push("/production/creation");
    };
 // Authentifizierung überprüfen
    useEffect(() => {
    if (!isLoading && !user) {
        router.push("/api/auth/login");
    }
}, [isLoading, user ]);
    // Omars Änderungen
    // **Verhindere das Rendern, während die Authentifizierung geprüft wird**
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Lädt...</div>;
    }

    if (!user) {
        return null; // Zeige nichts, falls die Weiterleitung aktiv ist
    }
    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8">Produktion</h1>
            <div className="flex gap-8">
                <button
                    onClick={handleNeuentwicklung}
                    className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Neuentwicklung
                </button>
                <button
                    onClick={handleHerstellung}
                    className="px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    Herstellung
                </button>
            </div>
        </div>
    );
};

export default ProductionOverviewPage;



