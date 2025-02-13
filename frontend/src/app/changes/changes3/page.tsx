"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaArrowLeft } from "react-icons/fa";

// Dummy-Daten, die später von echten API-Endpunkten ersetzt werden können
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
        materialCategory: "", // Hier entscheidet der Benutzer per Dropdown
        active: true,
        warehouse: "",
        quantity: 0,
        supplier: "",
        supplierLink: "",
    });

    // Produktspezifische Zusatzfelder
    const [extraDetails, setExtraDetails] = useState({
        // Für "docht"
        dochtLaenge: "",
        dochtMaterial: "",
        // Für "deckel"
        deckelFarbe: "",
        deckelMaterial: "",
        deckelZusatzname: "",
        // Für "behältnis"
        behalterFarbe: "",
        behalterHoehe: "",
        behalterBreite: "",
        behalterFuellmenge: "",
        behalterZusatzname: "", // Neu: Zusatzname für Behältnis
        // Für "warnettikett"
        warnettikettName: "",
        warnettikettFarbe: "",
        warnettikettHoehe: "",
        warnettikettBreite: "",
        warnettikettMaterial: "",
    });

    // Simuliere API-Aufrufe (Dummy-Daten)
    useEffect(() => {
        setTimeout(() => {
            setCategories(dummyCategories);
            setMaterialCategories(dummyMaterialCategories);
            setWarehouses(dummyWarehouses);
            setSuppliers(dummySuppliers);
        }, 500);
    }, []);

    // Allgemeine Eingabefelder bearbeiten
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

    // Formular absenden – Payload zusammenstellen (Dummy-Log)
    const handleSubmit = async (e) => {
        e.preventDefault();

        let payload = { ...productData };

        // Hänge produktspezifische Felder an, basierend auf der gewählten Material-Kategorie
        if (productData.materialCategory === "3") {
            // Docht
            payload = {
                ...payload,
                laenge: extraDetails.dochtLaenge,
                materialDetail: extraDetails.dochtMaterial,
            };
        } else if (productData.materialCategory === "11") {
            // Deckel
            payload = {
                ...payload,
                farbe: extraDetails.deckelFarbe,
                materialDetail: extraDetails.deckelMaterial,
                zusatzname: extraDetails.deckelZusatzname,
            };
        } else if (productData.materialCategory === "4") {
            // Behältnis
            payload = {
                ...payload,
                farbe: extraDetails.behalterFarbe,
                hoehe: extraDetails.behalterHoehe,
                breite: extraDetails.behalterBreite,
                fuellmenge: extraDetails.behalterFuellmenge,
                zusatzname: extraDetails.behalterZusatzname, // Zusatzname für Behältnis
            };
        } else if (productData.materialCategory === "12") {
            // WarnEtikett
            payload = {
                ...payload,
                warnettikettName: extraDetails.warnettikettName,
                warnettikettFarbe: extraDetails.warnettikettFarbe,
                warnettikettHoehe: extraDetails.warnettikettHoehe,
                warnettikettBreite: extraDetails.warnettikettBreite,
                warnettikettMaterial: extraDetails.warnettikettMaterial,
            };
        }

        console.log("New Product Payload:", payload);
        // Später POST-Request an /api/material (oder /api/recipes, falls Rezeptanlage)
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
                <h2 className="text-2xl font-semibold my-4">Lager & Lieferant</h2>
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

                {/* Zusätzliche Felder je nach gewählter Material-Kategorie */}
                {productData.materialCategory === "3" && (
                    // Docht
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

                {productData.materialCategory === "11" && (
                    // Deckel
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
                        <div className="md:col-span-2">
                            <label className="block text-gray-700">Zusatzname (optional)</label>
                            <input
                                type="text"
                                name="deckelZusatzname"
                                value={extraDetails.deckelZusatzname || ""}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {productData.materialCategory === "4" && (
                    // Behältnis
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
                            <label className="block text-gray-700">Füllmenge (ml)</label>
                            <input
                                type="number"
                                name="behalterFuellmenge"
                                value={extraDetails.behalterFuellmenge}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700">Zusatzname (optional)</label>
                            <input
                                type="text"
                                name="behalterZusatzname"
                                value={extraDetails.behalterZusatzname || ""}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}

                {productData.materialCategory === "12" && (
                    // WarnEtikett
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700">Warnettikett Name</label>
                            <input
                                type="text"
                                name="warnettikettName"
                                value={extraDetails.warnettikettName}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Warnettikett Farbe</label>
                            <input
                                type="text"
                                name="warnettikettFarbe"
                                value={extraDetails.warnettikettFarbe}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Höhe</label>
                            <input
                                type="number"
                                name="warnettikettHoehe"
                                value={extraDetails.warnettikettHoehe}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Breite</label>
                            <input
                                type="number"
                                name="warnettikettBreite"
                                value={extraDetails.warnettikettBreite}
                                onChange={handleExtraChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700">Material</label>
                            <input
                                type="text"
                                name="warnettikettMaterial"
                                value={extraDetails.warnettikettMaterial}
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
