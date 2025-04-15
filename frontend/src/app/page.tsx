"use client";

import Head from 'next/head';
import { FaBoxes, FaShoppingCart, FaTruckLoading } from 'react-icons/fa';
import { IoBuild } from "react-icons/io5";
import { MdSell } from "react-icons/md";
import FeatureCard from "./components/featurecard";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

export default function Home() {
    const { user, isLoading } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isMitarbeiter, setIsMitarbeiter] = useState(false);

    useEffect(() => {
        if (!user || isLoading) return;
    
        const roles: string[] = Array.isArray(user["https://candlewawi.com/roles"]) ? user["https://candlewawi.com/roles"] : [];
    
        console.log("User:", user);
        console.log("Rollen:", roles);
    
        const lowerRoles = roles.map((r) => r.toLowerCase());
    
        setIsAdmin(lowerRoles.includes("admin"));
        setIsMitarbeiter(lowerRoles.includes("mitarbeiter"));
    }, [user, isLoading]);
    
    

    if (isLoading) {
        return <p className="text-center text-lg">Lädt...</p>;
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
                <Head>
                    <title>Warenwirtschaftssoftware</title>
                    <meta name="description" content="Moderne Warenwirtschaftssoftware für dein Unternehmen" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className="flex flex-col items-center justify-center w-full flex-1 px-4">
                    <h1 className="text-4xl font-bold mb-6 text-gray-800">
                        Bitte loggen Sie sich ein!
                    </h1>
                    <p className="text-gray-600 mb-8 text-center max-w-md">
                        Um Zugriff auf die Warenwirtschaftssoftware zu erhalten, müssen Sie sich zuerst mit Ihrem Konto einloggen.
                    </p>
                    <a
                        href="/api/auth/login"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                    >
                        Zur Login-Seite
                    </a>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <Head>
                <title>Warenwirtschaftssoftware</title>
                <meta name="description" content="Moderne Warenwirtschaftssoftware für dein Unternehmen" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center justify-center w-full flex-1 px-4">
                <h1 className="text-4xl font-bold mb-8">
                    Willkommen zur Warenwirtschaftssoftware der Geruchsmanufaktur!
                </h1>

                <div className="flex space-x-6">
                    {(isAdmin || isMitarbeiter) && (
                        <>
                            <FeatureCard title="Wareneingang" href="/income" icon={<FaTruckLoading size={40} />} />
                            <FeatureCard title="Einkauf" href="/shopping" icon={<FaShoppingCart size={40} />} />
                            <FeatureCard title="Inventar" href="/inventory" icon={<FaBoxes size={40} />} />
                            <FeatureCard title="Herstellen" href="/production" icon={<IoBuild size={40} />} />
                            <FeatureCard title="Verkauf" href="/sale" icon={<MdSell size={40} />} />
                        </>
                    )}
                </div>

                {isAdmin && (
                    <div className="flex space-x-6 mt-8">
                        <FeatureCard title="Chefbereich" href="/changes" icon={<IoBuild size={40} />} />
                    </div>
                )}
            </main>
        </div>
    );
}
