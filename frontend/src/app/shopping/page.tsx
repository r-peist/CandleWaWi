"use client"
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';

// Dummy API functions
const fetchSuppliers = () => {
    return [
        { id: 1, name: "Lieferant A" },
        { id: 2, name: "Lieferant B" },
        { id: 3, name: "Lieferant C" },
        { id: 4, name: "Lieferant D" },
        { id: 5, name: "Lieferant E" },
    ];
};

const fetchMaterialsForSupplier = (supplierId: number) => {
    const materials = {
        1: ["Material A1", "Material A2", "Material A3"],
        2: ["Material B1", "Material B2"],
        3: ["Material C1", "Material C2", "Material C3", "Material C4"],
        4: ["Material D1"],
        5: ["Material E1", "Material E2"],
    };
    return materials[supplierId] || [];
};

const Home: NextPage = () => {
    const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
    const suppliers = fetchSuppliers();
    const materials = selectedSupplier !== null ? fetchMaterialsForSupplier(selectedSupplier) : [];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Head>
                <title>Warenwirtschaft</title>
                <meta name="description" content="Lieferanten und Materialien" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-center">Warenwirtschaftssoftware</h1>
            </header>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Wähle einen Lieferanten um Fortzufahren.</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {suppliers.map((supplier) => (
                        <li
                            key={supplier.id}
                            className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-200"
                            onClick={() => setSelectedSupplier(supplier.id)}
                        >
                            {supplier.name}
                        </li>
                    ))}
                </ul>
            </section>

            {selectedSupplier !== null && (
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Materialien von {suppliers.find(s => s.id === selectedSupplier)?.name}</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {materials.length > 0 ? (
                            materials.map((material, index) => (
                                <li key={index} className="p-4 bg-white shadow rounded">
                                    {material}
                                </li>
                            ))
                        ) : (
                            <li className="p-4 bg-white shadow rounded">Keine Materialien verfügbar</li>
                        )}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default Home;
