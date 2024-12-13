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

const fetchMaterialDetails = (material: string) => {
    const materialDetails = {
        "Material A1": { supplier: "Lieferant A", description: "https://example.com/material-a1" },
        "Material A2": { supplier: "Lieferant A", description: "https://example.com/material-a2" },
        "Material A3": { supplier: "Lieferant A", description: "https://example.com/material-a3" },
        "Material B1": { supplier: "Lieferant B", description: "https://example.com/material-b1" },
        "Material B2": { supplier: "Lieferant B", description: "https://example.com/material-b2" },
        // Add other material details as needed
    };
    return materialDetails[material] || { supplier: "Unbekannt", description: "Keine Beschreibung verfügbar" };
};

// Dummy API for creating orders
const createOrder = (cart) => {
    const orderId = Math.floor(Math.random() * 1000); // Simulated Order ID
    const orderDate = new Date().toLocaleDateString();
    const order = {
        orderId,
        orderDate,
        items: cart.map((item, index) => ({
            id: index + 1, // Simulated MatBestID
            material: item.material,
            link: item.link,
            quantity: Math.floor(Math.random() * 10) + 1, // Random quantity for demo
            comment: "",
        })),
    };
    console.log("Bestellung erstellt:", order); // Simulated backend logging
    return order;
};

const Home: NextPage = () => {
    const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const [cart, setCart] = useState<{ material: string; link: string }[]>([]);
    const [order, setOrder] = useState(null);

    const suppliers = fetchSuppliers();
    const materials = selectedSupplier !== null ? fetchMaterialsForSupplier(selectedSupplier) : [];
    const materialDetails = selectedMaterial ? fetchMaterialDetails(selectedMaterial) : null;

    const addToCart = (material: string, link: string) => {
        setCart((prevCart) => [...prevCart, { material, link }]);
    };

    const submitOrder = () => {
        if (cart.length === 0) {
            alert("Der Warenkorb ist leer!");
            return;
        }
        const newOrder = createOrder(cart);
        setOrder(newOrder);
        setCart([]); // Clear the cart after order creation
    };

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
                <h2 className="text-2xl font-semibold mb-4">Lieferanten</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {suppliers.map((supplier) => (
                        <li
                            key={supplier.id}
                            className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-200"
                            onClick={() => {
                                setSelectedSupplier(supplier.id);
                                setSelectedMaterial(null);
                            }}
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
                                <li
                                    key={index}
                                    className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-200"
                                    onClick={() => setSelectedMaterial(material)}
                                >
                                    {material}
                                </li>
                            ))
                        ) : (
                            <li className="p-4 bg-white shadow rounded">Keine Materialien verfügbar</li>
                        )}
                    </ul>
                </section>
            )}

            {selectedMaterial && materialDetails && (
                <section className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Details zu {selectedMaterial}</h2>
                    <table className="table-auto w-full bg-white shadow rounded">
                        <tbody>
                        <tr className="border-b">
                            <td className="p-4 font-semibold">Material</td>
                            <td className="p-4">{selectedMaterial}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-4 font-semibold">Lieferant</td>
                            <td className="p-4">{materialDetails.supplier}</td>
                        </tr>
                        <tr>
                            <td className="p-4 font-semibold">Beschreibung</td>
                            <td className="p-4">
                                <a href={materialDetails.description} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    {materialDetails.description}
                                </a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        onClick={() => addToCart(selectedMaterial, materialDetails.description)}
                    >
                        Zum Warenkorb hinzufügen
                    </button>
                </section>
            )}

            {cart.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Warenkorb</h2>
                    <ul className="bg-white shadow rounded p-4">
                        {cart.map((item, index) => (
                            <li key={index} className="border-b last:border-0 p-4">
                                <span className="font-semibold">{item.material}</span> -
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    {item.link}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                        onClick={submitOrder}
                    >
                        Bestellung abschicken
                    </button>
                </section>
            )}

            {order && (
                <section className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Bestellung erfolgreich</h2>
                    <p className="mb-4">Bestell-ID: {order.orderId}</p>
                    <p className="mb-4">Bestelldatum: {order.orderDate}</p>
                    <table className="table-auto w-full bg-white shadow rounded">
                        <thead>
                        <tr className="border-b">
                            <th className="p-4 text-left">Material</th>
                            <th className="p-4 text-left">Link</th>
                            <th className="p-4 text-left">Menge</th>
                            <th className="p-4 text-left">Kommentar</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-4">{item.material}</td>
                                <td className="p-4">
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                        {item.link}
                                    </a>
                                </td>
                                <td className="p-4">{item.quantity}</td>
                                <td className="p-4">{item.comment || "Keine Kommentare"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            )}
        </div>
    );
};

export default Home;