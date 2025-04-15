"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Head from 'next/head';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBoxes, FaShoppingCart, FaTruckLoading } from 'react-icons/fa';
import FeatureCard from "../components/featurecard";
import Footer from '../components/footer';

export default function Changes() {
    const { user, isLoading } = useUser(); // Auth0-Benutzer abrufen
    const router = useRouter();
    const [isAllowedUser, setIsAllowedUser] = useState(false);

    useEffect(() => {
        if (isLoading) return;
    
        if (!user) {
            router.push("/api/auth/login");
        } else {
            console.log("Benutzer-E-Mail:", user.email);
            const roles: string[] = Array.isArray(user["https://candlewawi.com/roles"])
                ? user["https://candlewawi.com/roles"]
                : [];
    
            const lowerRoles = roles.map(r => r.toLowerCase());
            const isAdmin = lowerRoles.includes("admin");
            
            setIsAllowedUser(isAdmin);
        }
    }, [user, isLoading]);
    

    if (isLoading) {
        return <p className="text-center text-lg">Lädt...</p>;
    }

    if (!isLoading && !user) {
    return <p className="text-center text-lg">Bitte einloggen...</p>;
}

if (!isLoading && user && !isAllowedUser) {
    return <p className="text-center text-lg">Zugriff verweigert</p>;
}
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col">
            <Head>
                <title>Warenwirtschaftssoftware</title>
                <meta name="description" content="Moderne Warenwirtschaftssoftware für dein Unternehmen" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="w-full py-6 bg-white shadow-md relative">
                <div className="container mx-auto px-4 flex items-center justify-center">
                    <h1 className="text-4xl font-semibold text-gray-800">Chefbereich</h1>
                </div>
                <button
                    onClick={() => router.push("/")}
                    className="text-xl absolute left-16 top-1/2 transform -translate-y-1/2 flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition duration-300"
                >
                    <FaArrowLeft className="text-gray-700" />
                    <span className="text-gray-700 text-xl">Zurück</span>
                </button>
            </header>

            <main className="flex flex-col items-center justify-center flex-1 px-4 py-12">
                <h2 className="text-4xl font-bold mb-8 text-gray-900 text-center">
                    Willkommen zum Chefbereich der Geruchsmanufaktur!
                </h2>
                <div className="flex flex-wrap justify-center gap-8">
                    <FeatureCard
                        title="Produkteanlegen"
                        description=""
                        href="/changes/changes3"
                        icon={<FaTruckLoading size={40} />}
                    />
                    <FeatureCard
                        title="Inventar"
                        description=""
                        href="/changes/changes1"
                        icon={<FaShoppingCart size={40} />}
                    />
                    <FeatureCard
                        title="Wareneingangskorrekturen"
                        description=""
                        href="/changes/changes2"
                        icon={<FaBoxes size={40} />}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
};


