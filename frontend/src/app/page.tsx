"use client";
import type { NextPage } from 'next'
import Head from 'next/head'
import FeatureCard from "./components/featurecard"
import Footer from './components/footer'
import { FaBoxes, FaShoppingCart, FaTruckLoading } from 'react-icons/fa'
import { IoBuild } from "react-icons/io5";
import { MdSell } from "react-icons/md";

const Home: NextPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
            <Head>
                <title>Warenwirtschaftssoftware</title>
                <meta name="description" content="Moderne Warenwirtschaftssoftware für dein Unternehmen" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center justify-center flex-1 px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900">
                        Willkommen zur Warenwirtschaftssoftware der Geruchsmanufaktur!
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <FeatureCard
                        title="Wareneingang"
                        description=""
                        href="/income"
                        icon={<FaTruckLoading size={40} />}
                    />
                    <FeatureCard
                        title="Einkauf"
                        description=""
                        href="/shopping"
                        icon={<FaShoppingCart size={40} />}
                    />
                    <FeatureCard
                        title="Inventar"
                        description=""
                        href="/inventory"
                        icon={<FaBoxes size={40} />}
                    />
                    <FeatureCard
                        title="Herstellen"
                        description=""
                        href="/production"
                        icon={<IoBuild size={40} />}
                    />
                    <FeatureCard
                        title="Verkauf"
                        description=""
                        href="/sale"
                        icon={<MdSell size={40} />}
                    />
                    <FeatureCard
                        title="Chef"
                        description=""
                        href="/changes"
                        icon={<IoBuild size={40} />}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
