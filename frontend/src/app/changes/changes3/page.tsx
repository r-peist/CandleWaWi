"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft } from "react-icons/fa";

// Dummy-Daten, die später von deinen echten API-Endpunkten ersetzt werden können
const dummyCategories = [
    { KatID: 1, Name: "Endprodukt" },
    { KatID: 4, Name: "Rohmaterial" },
    { KatID: 6, Name: "Verpackungsmat" },
    { KatID: 5, Name: "Zubehör" },
    { KatID: 2, Name: "zugekauftesEndprod" },
    { KatID: 3, Name: "Zwischenprodukt" },
];

const dummyMaterialCategories = [
    { MatKatID: 1, Name: "Endprodukt", Einheit: "stk" },
    { MatKatID: 2, Name: "Wachs", Einheit: "g" },
    { MatKatID: 3, Name: "Docht", Einheit: "stk" },
    { MatKatID: 4, Name: "Behältnis", Einheit: "stk" },
    { MatKatID: 5, Name: "Gemisch", Einheit: "ml" },
    { MatKatID: 6, Name: "Karton", Einheit: "stk" },
    { MatKatID: 7, Name: "Tüte", Einheit: "stk" },
    { MatKatID: 8, Name: "Öl", Einheit: "ml" },
    { MatKatID: 9, Name: "Etiketten", Einheit: "stk" },
    { MatKatID: 10, Name: "Geschenkboxen", Einheit: "stk" },
    { MatKatID: 11, Name: "Deckel", Einheit: "stk" },
    { MatKatID: 12, Name: "WarnEtikett", Einheit: "stk" },
    { MatKatID: 13, Name: "Sonstiges", Einheit: "stk" },
];

const dummyWarehouses = [
    { LagerID: 1, Name: "Burgstraße" },
    { LagerID: 2, Name: "Keller" },
    { LagerID: 3, Name: "Messe" },
];

const dummySuppliers = [
    { LiefID: 1, Name: "Amazon" },
    { LiefID: 2, Name: "Destrebution" },
    { LiefID: 3, Name: "ExternerLadeneinkauf" },
];

const NewProductPage = () => {
    const router = useRouter();

    // States für Dropdowns
    const [categories, setCategories] = useState([]);
    const [materialCategories, setMaterialCategories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    // Allgemeine Produktdaten (entspricht z. B. der Tabelle "material")
    const [productData, setProductData] = useState({
        name: "",
        sku: "",
        category: "",
        materialCategory: "",
        active: true,
        warehouse: "",
        quantity: 0,
        supplier: "",
        supplierLink: "",
        productType: "", // z. B. "docht", "deckel", "behaelter"
    });

    // Produktspezifische Zusatzfelder (für docht, deckel, behältnis)
    const [extraDetails, setExtraDetails] = useState({
        // Für "docht"
        dochtLaenge: "",
        dochtMaterial: "",
        // Für "deckel"
        deckelFarbe: "",
        deckelMaterial: "",
        // Für "behältnis"
        behalterFarbe: "",
        behalterHoehe: "",
        behalterBreite: "",
        behalterFuellmenge: "",
    });

    // Simuliere API-Aufrufe mit Dummy-Daten (hier mit setTimeout)
    useEffect(() => {
        setTimeout(() => {
            setCategories(dummyCategories);
            setMaterialCategories(dummyMaterialCategories);
            setWarehouses(dummyWarehouses);
            setSuppliers(dummySuppliers);
        }, 500);
    }, []);

    // Allgemeine Eingaben bearbeiten
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Zusatzfelder bearbeiten
    const handleExtraChange = (e) => {
        const { name, value } = e.target;
        setExtraDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Formular absenden (Payload zusammenstellen und simuliert absenden)
    const handleSubmit = async (e) => {
        e.preventDefault();

        let payload = { ...productData };

        // Produkttyp-spezifische Felder anhängen
        if (productData.productType === "docht") {
            payload = {
                ...payload,
                laenge: extraDetails.dochtLaenge,
                materialDetail: extraDetails.dochtMaterial,
            };
        } else if (productData.productType === "deckel") {
            payload = {
                ...payload,
                farbe: extraDetails.deckelFarbe,
                materialDetail: extraDetails.deckelMaterial,
            };
        } else if (productData.productType === "behaelter") {
            payload = {
                ...payload,
                farbe: extraDetails.behalterFarbe,
                hoehe: extraDetails.behalterHoehe,
                breite: extraDetails.behalterBreite,
                fuellmenge: extraDetails.behalterFuellmenge,
            };
        }

        // Hier könntest du nun einen POST-Request an dein Backend schicken.
        // Zum Simulieren loggen wir den Payload und navigieren zurück.
        console.log("New Product Payload:", payload);
        router.push("/changes");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8 flex justify-between items-center">
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow flex items-center gap-2"
                    onClick={() => router.push("/changes")}
                >
                    <FaArrowLeft />
                    Zurück
                </button>
                <h1 className="text-3xl font-bold">Neues Produkt anlegen</h1>
            </header>

            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
                {/* Allgemeine Produktdaten */}
                <h2 className="text-2xl font-semibold mb-4">Allgemeine Produktdaten</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Produktname</label>
                        <input
                            type="text"
                            name="name"
                            value={productData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">SKU</label>
                        <input
                            type="text"
                            name="sku"
                            value={productData.sku}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Kategorie</label>
                        <select
                            name="category"
                            value={productData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">-- Auswahl --</option>
                            {categories.map((cat) => (
                                <option key={cat.KatID} value={cat.KatID}>
                                    {cat.Name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Material-Kategorie</label>
                        <select
                            name="materialCategory"
                            value={productData.materialCategory}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">-- Auswahl --</option>
                            {materialCategories.map((mat) => (
                                <option key={mat.MatKatID} value={mat.MatKatID}>
                                    {mat.Name} ({mat.Einheit})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Aktiv</label>
                        <select
                            name="active"
                            value={productData.active ? "true" : "false"}
                            onChange={(e) =>
                                setProductData((prev) => ({
                                    ...prev,
                                    active: e.target.value === "true",
                                }))
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="true">Aktiv</option>
                            <option value="false">Inaktiv</option>
                        </select>
                    </div>
                </div>

                {/* Lager & Lieferant */}
                <h2 className="text-2xl font-semibold my-4">Lager &amp; Lieferant</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700">Lagerort</label>
                        <select
                            name="warehouse"
                            value={productData.warehouse}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">-- Auswahl --</option>
                            {warehouses.map((wh) => (
                                <option key={wh.LagerID} value={wh.LagerID}>
                                    {wh.Name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Menge</label>
                        <input
                            type="number"
                            name="quantity"
                            value={productData.quantity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Lieferant</label>
                        <select
                            name="supplier"
                            value={productData.supplier}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">-- Auswahl --</option>
                            {suppliers.map((sup) => (
                                <option key={sup.LiefID} value={sup.LiefID}>
                                    {sup.Name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Lieferanten-Link</label>
                        <input
                            type="url"
                            name="supplierLink"
                            value={productData.supplierLink}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Produkttyp-spezifische Details */}
                <h2 className="text-2xl font-semibold my-4">
                    Produkttyp-spezifische Details
                </h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Produkttyp auswählen</label>
                    <select
                        name="productType"
                        value={productData.productType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">-- Auswahl --</option>
                        <option value="none">Kein spezieller Typ</option>
                        <option value="docht">Docht</option>
                        <option value="deckel">Deckel</option>
                        <option value="behaelter">Behältnis</option>
                    </select>
                </div>

                {productData.productType === "docht" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700">Docht Länge</label>
                            <input
                                type="number"
                                name="dochtLaenge"
                                value={extraDetails.dochtLaenge}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Docht Material</label>
                            <input
                                type="text"
                                name="dochtMaterial"
                                value={extraDetails.dochtMaterial}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                )}

                {productData.productType === "deckel" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700">Deckel Farbe</label>
                            <input
                                type="text"
                                name="deckelFarbe"
                                value={extraDetails.deckelFarbe}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Deckel Material</label>
                            <input
                                type="text"
                                name="deckelMaterial"
                                value={extraDetails.deckelMaterial}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                )}

                {productData.productType === "behaelter" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700">Behälter Farbe</label>
                            <input
                                type="text"
                                name="behalterFarbe"
                                value={extraDetails.behalterFarbe}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Höhe</label>
                            <input
                                type="number"
                                name="behalterHoehe"
                                value={extraDetails.behalterHoehe}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Breite</label>
                            <input
                                type="number"
                                name="behalterBreite"
                                value={extraDetails.behalterBreite}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Füllmenge</label>
                            <input
                                type="number"
                                name="behalterFuellmenge"
                                value={extraDetails.behalterFuellmenge}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-8">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow flex items-center gap-2"
                    >
                        <FaSave />
                        Produkt anlegen
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewProductPage;
