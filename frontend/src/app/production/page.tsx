"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProductionOverviewPage = () => {
    const router = useRouter();
    const { user, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [isLoading, user]); // `router` entfernt, da stabil

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Lädt...</div>;
    }

    if (!user) {
        return null; // Falls der Redirect aktiv ist, nichts rendern
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8">Produktion</h1>
            <div className="flex gap-8">
                <button
                    onClick={() => router.push("/recipes")}
                    className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Neuentwicklung
                </button>
                <button
                    onClick={() => router.push("/production/creation")}
                    className="px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    Herstellung
                </button>
            </div>
        </div>
    );
};

export default ProductionOverviewPage;
