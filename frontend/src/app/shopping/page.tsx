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
        const response = await fetch('/api/suppliermaterials', {
            method: 'POST',
            body: JSON.stringify({ LiefID: supplierId }),
        });
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Materialien');
        }
        const { data } = await response.json(); // Extrahiert die relevanten Daten
        return data; // Datenstruktur: [{ MatLiefID, MatID, LiefID, Link, MaterialName, LieferantName }]
    } catch (error) {
        console.error('Fehler beim Laden der Materialien:', error);
        return [];
    }
};

const Home: NextPage = () => {
    const [suppliers, setSuppliers] = useState<{ LiefID: number; Name: string }[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
    const [materials, setMaterials] = useState<any[]>([]); // Array mit Material-Daten
    const [cart, setCart] = useState<{ material: string; link: string }[]>([]);
    const [order, setOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const toggleCartItem = (material, link) => {
        setCart((prevCart) => {
            const exists = prevCart.find((item) => item.material === material);
            if (exists) {
                // Entferne Material, wenn es bereits im Warenkorb ist
                return prevCart.filter((item) => item.material !== material);
            } else {
                // Füge Material hinzu, wenn es noch nicht im Warenkorb ist
                return [...prevCart, { material, link }];
            }
        });
    };

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

    const addToCart = (material, link) => toggleCartItem(material, link);

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
        setShowModal(false);
        alert(`Bestellung ${newOrder.orderId} ausgeführt`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Head>
                <title>Warenwirtschaft</title>
                <meta name="description" content="Lieferanten und Materialien"/>
                <link rel="icon" href="/favicon.ico"/>
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
                                className={`p-4 bg-white shadow-md rounded-lg cursor-pointer transform transition duration-200 ${
                                    selectedSupplier === supplier.LiefID
                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                        : "hover:bg-gray-100"
                                }`}
                                onClick={async () => {
                                    try {
                                        setSelectedSupplier(supplier.LiefID); // Lieferant speichern
                                        const materialData = await fetchMaterialsForSupplier(supplier.LiefID);
                                        setMaterials(materialData); // Materialien speichern
                                    } catch (error) {
                                        console.error("Fehler beim Laden der Materialien:", error);
                                    }
                                }}
                            >
                                <p className="text-center text-lg font-medium">{supplier.Name}</p>
                            </li>
                        ))
                    ) : (
                        <li className="p-4 bg-white shadow-md rounded-lg text-center">Keine Lieferanten verfügbar</li>
                    )}
                </ul>
            </section>

            {selectedSupplier !== null && (
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Materialien</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {materials.length > 0 ? (
                            materials.map((material) => {
                                const isInCart = cart.some((item) => item.material === material.MaterialName);

                                return (
                                    <li
                                        key={material.MatLiefID}
                                        className={`p-4 bg-white shadow-md rounded-lg cursor-pointer flex justify-between items-center transform transition duration-200 ${
                                            isInCart ? "bg-green-200 border-2 border-green-500" : "hover:bg-gray-100"
                                        }`}
                                    >
                                        <div>
                                            <p className="font-semibold text-lg">{material.MaterialName}</p>
                                            <p className="text-sm text-gray-500">Lieferant: {material.LieferantName}</p>
                                            <a
                                                href={material.Link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                            >
                                                Link zum Material
                                            </a>
                                        </div>
                                        <button
                                            className={`px-4 py-2 rounded ${
                                                isInCart
                                                    ? "bg-red-500 text-white hover:bg-red-600"
                                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                            }`}
                                            onClick={() => toggleCartItem(material.MaterialName, material.Link)}
                                        >
                                            {isInCart ? "Entfernen" : "Hinzufügen"}
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="p-4 bg-white shadow-md rounded-lg text-center">Keine Materialien verfügbar</li>
                        )}
                    </ul>
                </section>
            )}

            {cart.length > 0 && (
                <aside className="fixed right-0 top-0 h-full bg-white shadow-lg p-4 w-64">
                    <h2 className="text-2xl font-semibold mb-4">Warenkorb</h2>
                    <ul className="overflow-y-auto max-h-80">
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
                        onClick={() => setShowModal(true)}
                    >
                        Einkauf abschließen
                    </button>
                </aside>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-2xl font-semibold mb-4">Bestellung überprüfen</h2>
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
                            Einkauf in DB hinterlegen
                        </button>
                        <button
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                            onClick={() => setShowModal(false)}
                        >
                            Abbrechen
                        </button>
                    </div>
                </div>
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
                                <td className="p-4">{item.comment || 'Keine Kommentare'}</td>
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

