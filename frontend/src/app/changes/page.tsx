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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <Head>
                <title>Chefbereich</title>
            </Head>

            <main className="flex flex-col items-center justify-center w-full flex-1 px-4">
                <h1 className="text-4xl font-bold mb-8">Willkommen im Chefbereich!</h1>
                <div className="flex space-x-9">
                    <FeatureCard title="Produkte anlegen" href="/changes/changes3" icon={<FaTruckLoading size={40} />} />
                    <FeatureCard title="Inventar" href="/changes/changes1" icon={<FaShoppingCart size={40} />} />
                    <FeatureCard title="Wareneingangskorrekturen" href="/changes/changes2" icon={<FaBoxes size={40} />} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
