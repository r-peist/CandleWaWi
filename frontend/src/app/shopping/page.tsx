"use client";
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Lieferanten abrufen – es wird nun die Eigenschaft "Lieferanten" erwartet
async function fetchSuppliers() {
    try {
        const response = await fetch("/api/suppliers", { method: "GET" });
        if (!response.ok) throw new Error("Fehler beim Abrufen der Lieferanten");
        const { Lieferanten } = await response.json();
        return Lieferanten;
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Materialien für einen Lieferanten abrufen – Request-Body entspricht { Lieferant: { LiefID: ... } }
const fetchMaterialsForSupplier = async (supplierId: number) => {
    try {
        const response = await fetch("/api/suppliermaterials", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Lieferant: { LiefID: supplierId } }),
        });
        if (!response.ok) {
            throw new Error("Fehler beim Abrufen der Materialien");
        }
        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error("Fehler beim Laden der Materialien:", error);
        return [];
    }
};

const Home: NextPage = () => {
    const [suppliers, setSuppliers] = useState<{ LiefID: number; Name: string }[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
    const [materials, setMaterials] = useState<any[]>([]);
    const [cart, setCart] = useState<
        { material: string; link: string; supplier: string; MatID: number; quantity: number }[]
    >([]);
    const [showCartModal, setShowCartModal] = useState(false);

    const suppliersLoaded = useRef(false);
    const router = useRouter();

    const toggleCartItem = (material: string, link: string, supplier: string, MatID: number) => {
        setCart((prevCart) => {
            const exists = prevCart.find((item) => item.material === material);
            if (exists) {
                return prevCart.filter((item) => item.material !== material);
            } else {
                if (prevCart.length > 0 && prevCart[0].supplier !== supplier) {
                    alert("Sie können nur Artikel von einem Lieferanten in den Warenkorb legen.");
                    return prevCart;
                }
                return [...prevCart, { material, link, supplier, MatID, quantity: 1 }];
            }
        });
    };

    const updateCartItemQuantity = (material: string, newQuantity: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.material === material ? { ...item, quantity: Math.max(1, newQuantity) } : item
            )
        );
    };

    // Lieferanten dynamisch laden
    useEffect(() => {
        if (!suppliersLoaded.current) {
            const loadSuppliers = async () => {
                const supplierData = await fetchSuppliers();
                setSuppliers(supplierData);
            };
            loadSuppliers();
            suppliersLoaded.current = true;
        }
    }, []);

    // Materialien laden, wenn ein Lieferant ausgewählt wurde
    useEffect(() => {
        const loadMaterials = async () => {
            if (selectedSupplier !== null) {
                const materialData = await fetchMaterialsForSupplier(selectedSupplier);
                setMaterials(materialData);
            }
        };
        loadMaterials();
    }, [selectedSupplier]);

    // Bestellung abschicken – Request-Body wird als { Bestellung: { ... } } versendet
    const submitOrder = async () => {
        if (cart.length === 0) {
            alert("Der Warenkorb ist leer!");
            return;
        }

        const orderData = {
            LiefID: selectedSupplier,
            LagerID: 1, // Dummy-Wert, anpassbar
            Datum: new Date().toISOString().split("T")[0],
            Materialien: cart.map((item) => ({
                MatID: item.MatID,
                Menge: item.quantity,
            })),
        };

        console.log("Bestellung wird vorbereitet:", orderData);

        try {
            const response = await fetch("/api/bestellung", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Bestellung: orderData }),
            });

            if (!response.ok) {
                throw new Error("Fehler beim Abschicken der Bestellung.");
            }

            const data = await response.json();
            console.log("Bestellung erfolgreich:", data);

            alert("Einkauf erfolgreich! Bestellung wurde gesendet.");
            setCart([]);
            setShowCartModal(false);
        } catch (error) {
            console.error("Fehler beim Abschicken der Bestellung:", error);
            alert("Fehler beim Abschicken der Bestellung. Bitte versuchen Sie es erneut.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8 flex flex-col">
            <Head>
                <title>WaWi - GM - Einkauf</title>
                <meta name="description" content="Lieferanten und Materialien" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="mb-10 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition duration-300"
                        onClick={() => router.push("/")}
                    >
                        <FaArrowLeft size={18} className="text-gray-700" />
                        <span className="text-gray-700">Zurück</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Warenwirtschaftssoftware</h1>
                </div>
                <div className="relative cursor-pointer" onClick={() => setShowCartModal(true)}>
                    <FaShoppingCart size={30} className="text-gray-700" />
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
                    )}
                </div>
            </header>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lieferanten</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {suppliers.length > 0 ? (
                        suppliers.map((supplier) => (
                            <li
                                key={supplier.LiefID}
                                className={`p-4 bg-white rounded-xl shadow-md cursor-pointer transform transition duration-200 hover:shadow-lg ${
                                    selectedSupplier === supplier.LiefID
                                        ? "border-2 border-blue-600 text-blue-600"
                                        : "hover:bg-gray-50"
                                }`}
                                onClick={async () => {
                                    setSelectedSupplier(supplier.LiefID);
                                    const materialData = await fetchMaterialsForSupplier(supplier.LiefID);
                                    setMaterials(materialData);
                                }}
                            >
                                <p className="text-center text-lg font-medium">{supplier.Name}</p>
                            </li>
                        ))
                    ) : (
                        <li className="p-4 bg-white rounded-xl shadow-md text-center text-gray-700">
                            Keine Lieferanten verfügbar
                        </li>
                    )}
                </ul>
            </section>

            {selectedSupplier !== null && (
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Materialien</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {materials.length > 0 ? (
                            materials.map((material) => {
                                const isInCart = cart.some(
                                    (item) => item.material === material.MaterialName
                                );
                                return (
                                    <li
                                        key={material.MatLiefID}
                                        className={`p-4 bg-white rounded-xl shadow-md cursor-pointer flex justify-between items-center transform transition duration-200 ${
                                            isInCart
                                                ? "bg-green-200 border-2 border-green-500"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <div>
                                            <p className="font-semibold text-lg text-gray-800">
                                                {material.MaterialName}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Lieferant: {material.LieferantName}
                                            </p>
                                            <a
                                                href={material.Link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline text-sm"
                                            >
                                                Link zum Material
                                            </a>
                                        </div>
                                        <button
                                            className={`px-4 py-2 rounded transition duration-300 ${
                                                isInCart
                                                    ? "bg-red-500 text-white hover:bg-red-600"
                                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                            }`}
                                            onClick={() =>
                                                toggleCartItem(
                                                    material.MaterialName,
                                                    material.Link,
                                                    material.LieferantName,
                                                    material.MatID
                                                )
                                            }
                                        >
                                            {isInCart ? "Entfernen" : "Hinzufügen"}
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="p-4 bg-white rounded-xl shadow-md text-center text-gray-700">
                                Keine Materialien verfügbar
                            </li>
                        )}
                    </ul>
                </section>
            )}

            {showCartModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-xl w-3/4 max-w-2xl relative">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none text-2xl"
                            onClick={() => setShowCartModal(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">🛒 Ihr Warenkorb</h2>
                        {cart.length === 0 ? (
                            <p className="text-center text-gray-600">Ihr Warenkorb ist leer.</p>
                        ) : (
                            <div className="overflow-y-auto max-h-80">
                                <ul className="divide-y divide-gray-300">
                                    {cart.map((item, index) => (
                                        <li key={index} className="py-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-lg text-gray-800">{item.material}</p>
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 hover:text-blue-700 text-sm"
                                                >
                                                    Zum Material
                                                </a>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center">
                                                    <label
                                                        htmlFor={`quantity-${index}`}
                                                        className="text-sm font-medium text-gray-600 mr-2"
                                                    >
                                                        Menge:
                                                    </label>
                                                    <input
                                                        id={`quantity-${index}`}
                                                        type="number"
                                                        className="border rounded px-2 py-1 w-16 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                        min={1}
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateCartItemQuantity(item.material, parseInt(e.target.value, 10))
                                                        }
                                                    />
                                                </div>
                                                <button
                                                    className="text-red-500 hover:text-red-700 font-semibold"
                                                    onClick={() =>
                                                        toggleCartItem(item.material, item.link, item.supplier, item.MatID)
                                                    }
                                                >
                                                    Entfernen
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {cart.length > 0 && (
                            <div className="mt-6 flex justify-between items-center">
                                <p className="text-lg font-semibold text-gray-800">
                                    Gesamt: <span className="text-blue-500">{cart.length} Artikel</span>
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow transition duration-300"
                                        onClick={submitOrder}
                                    >
                                        Bestellung abschicken
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow transition duration-300"
                                        onClick={() => setShowCartModal(false)}
                                    >
                                        Schließen
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
