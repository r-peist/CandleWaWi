"use client";
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';

// Fetch-Funktionen für die API
async function fetchSuppliers() {
    try {
        const response = await fetch('/api/suppliers', { method: 'GET' });
        if (!response.ok) throw new Error('Fehler beim Abrufen der Lieferanten');
        const { data } = await response.json(); // Nur `data` extrahieren
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}


const fetchMaterialsForSupplier = async (supplierId: number) => {
    try {
        console.log("LiefID = ", supplierId);
        const response = await fetch('/api/suppliermaterials'
            , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ LiefID: supplierId }),
        });
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Materialien');
        }
        const data = await response.json();
        return data; // Erwartet Materialliste
    } catch (error) {
        console.error('Fehler beim Laden der Materialien:', error);
        return [];
    }
};


const fetchMaterialDetails = async (materialId: number) => {
    try {
        const response = await fetch('/api/materialDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ materialId }),
        });
        if (!response.ok) throw new Error('Fehler beim Abrufen der Materialdetails');
        const data = await response.json();
        return data; // Enthält Details wie Beschreibung, Lieferant etc.
    } catch (error) {
        console.error(error);
        return null;
    }
};

const Home: NextPage = () => {
    const [suppliers, setSuppliers] = useState<{ LiefID: number; Name: string }[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
    const [materials, setMaterials] = useState<string[]>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const [materialDetails, setMaterialDetails] = useState<{ supplier: string; description: string } | null>(null);
    const [cart, setCart] = useState<{ material: string; link: string }[]>([]);
    const [order, setOrder] = useState(null);

    // Lieferanten dynamisch laden
    useEffect(() => {
        const loadSuppliers = async () => {
            const supplierData = await fetchSuppliers();
            setSuppliers(supplierData);
        };
        loadSuppliers();
    }, []);

    // Materialien dynamisch laden, wenn ein Lieferant ausgewählt wird
    useEffect(() => {
        const loadMaterials = async () => {
            if (selectedSupplier !== null) {
                const materialData = await fetchMaterialsForSupplier(selectedSupplier);
                setMaterials(materialData);
            }
        };
        loadMaterials();
    }, [selectedSupplier]);

    // Materialdetails dynamisch laden, wenn ein Material ausgewählt wird
    useEffect(() => {
        const loadMaterialDetails = async () => {
            if (selectedMaterial) {
                const details = await fetchMaterialDetails(selectedMaterial);
                setMaterialDetails(details);
            }
        };
        loadMaterialDetails();
    }, [selectedMaterial]);

    const addToCart = (material: string, link: string) => {
        setCart((prevCart) => [...prevCart, { material, link }]);
    };

    const submitOrder = () => {
        if (cart.length === 0) {
            alert("Der Warenkorb ist leer!");
            return;
        }
        // Simulierte Backend-Bestellfunktion
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
                    {suppliers.length > 0 ? (
                        suppliers.map((supplier) => (
                            <li
                                key={supplier.LiefID}
                                className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-200"
                                onClick={async () => {
                                    setSelectedSupplier(supplier.LiefID); // Lieferant speichern
                                    const materialData = await fetchMaterialsForSupplier(supplier.LiefID);
                                    setMaterials(materialData); // Materialien speichern
                                    setSelectedMaterial(null); // Auswahl zurücksetzen
                                }}
                            >
                                {supplier.Name}
                            </li>
                        ))
                    ) : (
                        <li className="p-4 bg-white shadow rounded">Keine Lieferanten verfügbar</li>
                    )}
                </ul>
            </section>


            {selectedSupplier !== null && (
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Materialien</h2>
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
