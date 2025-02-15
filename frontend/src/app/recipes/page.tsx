"use client";
import React, { useState, useEffect, useMemo } from "react";
import { IoMdClose } from "react-icons/io";
import { FaArrowLeft, FaPlus, FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Hilfsfunktion: Konvertiert ISO 8601-Datum (z. B. "2024-11-26T23:00:00.000Z")
// in das MySQL-kompatible Format "YYYY-MM-DD HH:MM:SS"
const formatForMySQL = (dateString: string) => {
    const date = new Date(dateString);
    const YYYY = date.getFullYear();
    const MM = ("0" + (date.getMonth() + 1)).slice(-2);
    const DD = ("0" + date.getDate()).slice(-2);
    const HH = ("0" + date.getHours()).slice(-2);
    const mm = ("0" + date.getMinutes()).slice(-2);
    const SS = ("0" + date.getSeconds()).slice(-2);
    return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${SS}`;
};

// Rezeptdaten abrufen
const fetchRecipes = async () => {
    const res = await fetch("/api/rezept", { cache: "no-store" });
    if (!res.ok) throw new Error(`Fehler: ${res.status}`);
    return await res.json();
};

// Inventardaten abrufen (Pfad: /api/inventory)
const fetchInventory = async () => {
    try {
        const res = await fetch("/api/inventory", { cache: "no-store" });
        if (!res.ok) throw new Error("Fehler beim Abrufen des Inventars");
        return await res.json();
    } catch (error) {
        console.error("Fehler beim Laden des Inventars:", error);
        return [];
    }
};

const RecipeOverviewPage = () => {
    const router = useRouter();

    // Zustände für Rezepte, Fehler, Modal und Inventardaten
    const [recipes, setRecipes] = useState({ Kerze: [], SprayDiff: [], ZP: [] });
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState({ recipe: null, type: "" });
    const [formData, setFormData] = useState<any>({});
    const [inventoryOptions, setInventoryOptions] = useState<any[]>([]);

    // Hilfsfunktionen für Datum (UI‑Format, z. B. "26.11.2024") und für Input‑Felder (YYYY‑MM‑DD)
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    };
    const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
    };

    // Rezepte laden
    const loadRecipes = async () => {
        try {
            const data = await fetchRecipes();
            setRecipes({
                Kerze: data.Kerze || [],
                SprayDiff: data.SprayDiff || [],
                ZP: data.ZP || [],
            });
        } catch (err: any) {
            setError(err.message);
        }
    };
    useEffect(() => {
        loadRecipes();
    }, []);

    // Inventardaten laden und in eine flache Liste transformieren
    useEffect(() => {
        async function loadInventory() {
            const data = await fetchInventory();
            // data ist ein Array von Gruppen, z. B. { Kategorie: "Wachs", Materialien: [ {...}, ... ] }
            const flat = data.reduce((acc: any[], group: any) => {
                if (Array.isArray(group.Materialien)) {
                    const items = group.Materialien.map((item: any) => ({
                        ...item,
                        MaterialKategorie: group.Kategorie,
                    }));
                    return acc.concat(items);
                }
                return acc;
            }, []);
            setInventoryOptions(flat);
        }
        loadInventory();
    }, []);

    // Erstelle eine Lookup-Tabelle: Für jede Kategorie werden die Items anhand der jeweils relevanten ID abgelegt
    // Für "Behältnis" nutzen wir item.BehaelterID, für "Deckel" item.DeckelID, für "Docht" item.DochtID,
    // für "WarnEtikett" item.WarnEttID; sonst wird item.MatID verwendet.
    const inventoryLookup = useMemo(() => {
        return inventoryOptions.reduce((acc: any, item: any) => {
            const cat = item.MaterialKategorie;
            if (!acc[cat]) acc[cat] = {};
            if (cat === "Behältnis") {
                acc[cat][item.BehaelterID || item.MatID] = item;
            } else if (cat === "Deckel") {
                acc[cat][item.DeckelID || item.MatID] = item;
            } else if (cat === "Docht") {
                acc[cat][item.DochtID || item.MatID] = item;
            } else if (cat === "WarnEtikett" || cat.toLowerCase() === "warnetikett") {
                acc[cat][item.WarnEttID || item.MatID] = item;
            } else {
                acc[cat][item.MatID] = item;
            }
            return acc;
        }, {});
    }, [inventoryOptions]);

    // Für das Modal: Dropdowns basierend auf Inventardaten
    const materialsOptions = inventoryOptions.filter((item) => item.MaterialKategorie === "Wachs");
    const behOptions = inventoryOptions
        .filter((item) => item.MaterialKategorie === "Behältnis")
        .map((item) => ({
            id: item.BehaelterID || item.MatID,
            Materialname: item.Behaeltername || item.Materialname,
        }));
    const deckelOptions = inventoryOptions
        .filter((item) => item.MaterialKategorie === "Deckel")
        .map((item) => ({
            id: item.DeckelID || item.MatID,
            Materialname: item.Deckelname || item.Materialname,
        }));
    const dochtOptions = inventoryOptions
        .filter((item) => item.MaterialKategorie === "Docht")
        .map((item) => ({
            id: item.DochtID || item.MatID,
            Materialname: item.Dochtname || item.Materialname,
        }));
    const warnEttOptions = inventoryOptions
        .filter(
            (item) =>
                item.MaterialKategorie === "WarnEtikett" ||
                item.MaterialKategorie.toLowerCase() === "warnetikett"
        )
        .map((item) => ({
            id: item.WarnEttID || item.MatID,
            Materialname: item.Warnettikettname || item.Materialname,
        }));
    // Für Zwischenprodukte: Kombiniere Optionen aus Inventar (Gemisch, Öl) und Rezeptdaten (ZP)
    const inventoryZPOptions = inventoryOptions
        .filter((item) => item.MaterialKategorie === "Gemisch" || item.MaterialKategorie === "Öl")
        .map((item) => ({ id: item.MatID, name: item.Materialname }));
    const recipeZPOptions = (recipes.ZP || []).map((zp: any) => ({ id: zp.ZPRezeptID, name: zp.Name }));
    const combinedZPOptions = useMemo(() => {
        const all = [...recipeZPOptions, ...inventoryZPOptions];
        return Array.from(new Map(all.map((opt) => [opt.id, opt])).values());
    }, [recipeZPOptions, inventoryZPOptions]);

    // Für SprayDiff: Dedupliziere doppelte Einträge
    const uniqueSprayDiff = useMemo(() => {
        const map = new Map();
        recipes.SprayDiff.forEach((item: any) => {
            if (!map.has(item.RezeptSprayDifID)) {
                map.set(item.RezeptSprayDifID, item);
            }
        });
        return Array.from(map.values());
    }, [recipes.SprayDiff]);

    // Öffne das Bearbeitungs-Modal – setze die aktuellen Default‑Werte (Update‑Modus)
    const openModalForRecipe = (recipe: any, type: string) => {
        setSelectedRecipe({ recipe, type });
        if (type === "ZP") {
            setFormData({
                Name: recipe.Name || "",
                Beschreibung: recipe.Beschreibung || "",
                Releasedate: recipe.Releasedate || "",
                Changedate: recipe.Changedate || "",
                ZPRezeptID: recipe.ZPRezeptID || "",
                ZPItems: recipe.Zutaten || [],
            });
        } else {
            setFormData({
                RezeptKerzeID: recipe.RezeptKerzeID || "",
                RezeptSprayDifID: recipe.RezeptSprayDifID || "",
                Name: recipe.Name || "",
                MatID: recipe.MatID || "",
                Name_Mat: recipe.Name_Mat || "",
                BehaelterID: recipe.BehaelterID || "",
                Behaelter_name: recipe.Behaelter_name || "",
                DeckelID: recipe.DeckelID || "",
                Deckel_name: recipe.Deckel_name || "",
                DochtID: recipe.DochtID || "",
                Docht_name: recipe.Docht_name || "",
                WarnEttID: recipe.WarnEttID || "",
                WarnEtt_name: recipe.WarnEtt_name || "",
                ZPRezeptID: recipe.ZPRezeptID || "",
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRecipe({ recipe: null, type: "" });
    };

    const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleZPItemChange = (index: number, field: string, value: string) => {
        const newItems = formData.ZPItems ? [...formData.ZPItems] : [];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData((prev: any) => ({ ...prev, ZPItems: newItems }));
    };

    const addZPItem = () => {
        const newItems = formData.ZPItems ? [...formData.ZPItems] : [];
        newItems.push({ productId: "", quantity: "" });
        setFormData((prev: any) => ({ ...prev, ZPItems: newItems }));
    };

    const removeZPItem = (index: number) => {
        const newItems = formData.ZPItems.filter((_: any, i: number) => i !== index);
        setFormData((prev: any) => ({ ...prev, ZPItems: newItems }));
    };

    // Aufbau des Update-Payloads (nur Updates – INSERTs werden hier nicht behandelt)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRecipe.type === "ZP" && formData.ZPItems) {
            const sum = formData.ZPItems.reduce((acc: number, item: any) => acc + Number(item.quantity || 0), 0);
            if (sum > 100) {
                alert("Die Summe der Verhältniswerte darf maximal 100 betragen!");
                return;
            }
        }
        let payload = {};
        if (selectedRecipe.type === "ZP") {
            payload = {
                Rezept: {
                    ZP: {
                        ZPRezeptID: Number(formData.ZPRezeptID),
                        Name: formData.Name,
                        Beschreibung: formData.Beschreibung,
                        // Ändere Changedate in ein MySQL‑kompatibles Format (sofern angegeben)
                        Changedate: formData.Changedate ? formatForMySQL(formData.Changedate) : "",
                        Zutaten: formData.ZPItems,
                    },
                },
            };
        } else if (selectedRecipe.type === "Kerze") {
            // Lookup der korrekten Einträge – hier werden die richtigen IDs (z. B. BehälterID) verwendet
            const selectedMaterial = materialsOptions.find((item) => Number(item.MatID) === Number(formData.MatID)) || {};
            const selectedBeh = behOptions.find((item) => Number(item.id) === Number(formData.BehaelterID)) || {};
            const selectedDeckel = deckelOptions.find((item) => Number(item.id) === Number(formData.DeckelID)) || {};
            const selectedDocht = dochtOptions.find((item) => Number(item.id) === Number(formData.DochtID)) || {};
            const selectedWarn = warnEttOptions.find((item) => Number(item.id) === Number(formData.WarnEttID)) || {};
            const selectedZP = combinedZPOptions.find((item) => Number(item.id) === Number(formData.ZPRezeptID)) || {};
            payload = {
                Rezept: {
                    Kerze: {
                        RezeptKerzeID: Number(formData.RezeptKerzeID),
                        Name: formData.Name,
                        MatID: Number(formData.MatID),
                        Name_Mat: selectedMaterial.Materialname || "N/A",
                        BehaelterID: Number(formData.BehaelterID),
                        Behaelter_name: selectedBeh.Materialname || "N/A",
                        DeckelID: formData.DeckelID ? Number(formData.DeckelID) : 0,
                        Deckel_name: formData.DeckelID ? (selectedDeckel.Materialname || "N/A") : "N/A",
                        DochtID: Number(formData.DochtID),
                        Docht_name: selectedDocht.Materialname || "N/A",
                        WarnEttID: Number(formData.WarnEttID),
                        WarnEtt_name: selectedWarn.Materialname || "N/A",
                        ZPRezeptID: Number(formData.ZPRezeptID),
                        ZP_name: selectedZP.name || "N/A",
                    },
                },
            };
        } else if (selectedRecipe.type === "SprayDiff") {
            const selectedBeh = behOptions.find((item) => Number(item.id) === Number(formData.BehaelterID)) || {};
            const selectedDeckel = deckelOptions.find((item) => Number(item.id) === Number(formData.DeckelID)) || {};
            const selectedWarn = warnEttOptions.find((item) => Number(item.id) === Number(formData.WarnEttID)) || {};
            const selectedZP1 = combinedZPOptions.find((item) => Number(item.id) === Number(formData.ZPRezeptID1)) || {};
            const selectedZP2 = combinedZPOptions.find((item) => Number(item.id) === Number(formData.ZPRezeptID2)) || {};
            payload = {
                Rezept: {
                    SprayDiff: {
                        RezeptSprayDifID: Number(formData.RezeptSprayDifID),
                        Name: formData.Name,
                        BehaelterID: Number(formData.BehaelterID),
                        Behaelter_name: selectedBeh.Materialname || "N/A",
                        DeckelID: Number(formData.DeckelID),
                        Deckel_name: selectedDeckel.Materialname || "N/A",
                        WarnEttID: Number(formData.WarnEttID),
                        WarnEtt_name: selectedWarn.Materialname || "N/A",
                        ZPRezeptID1: Number(formData.ZPRezeptID1),
                        ZP_name1: selectedZP1.name || "N/A",
                        ZPRezeptID2: Number(formData.ZPRezeptID2),
                        ZP_name2: selectedZP2.name || "N/A",
                    },
                },
            };
        }
        try {
            const res = await fetch("/api/rezept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`Fehler: ${res.status}`);
            const result = await res.json();
            alert(result.Updated?.message || "Rezept aktualisiert!");
            closeModal();
            await loadRecipes();
        } catch (err: any) {
            alert("Fehler beim Speichern: " + err.message);
        }
    };

    // Renderen – drei Tabellen gleichzeitig anzeigen
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8 flex justify-between items-center">
                <button
                    onClick={() => router.push("/production")}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 flex items-center gap-2"
                >
                    <FaArrowLeft /> Zurück
                </button>
                <h1 className="text-3xl font-bold">Rezeptübersicht</h1>
                <button
                    onClick={() => router.push("/recipes/new")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                >
                    <FaPlus /> Neues Rezept
                </button>
            </header>

            {/* Anzeigen der drei Tabellen */}
            <section className="space-y-8">
                {/* Tabelle Kerze */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Kerze</h2>
                    <table className="table-auto w-full bg-white shadow-lg rounded-lg mb-4">
                        <thead>
                        <tr className="border-b bg-gray-200 text-gray-800">
                            <th className="p-4 text-left font-semibold">Rezept-ID</th>
                            <th className="p-4 text-left font-semibold">Name</th>
                            <th className="p-4 text-left font-semibold">Material</th>
                            <th className="p-4 text-left font-semibold">Behälter</th>
                            <th className="p-4 text-left font-semibold">Docht</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recipes.Kerze.map((r: any) => {
                            const invMat = inventoryLookup["Wachs"] && inventoryLookup["Wachs"][r.MatID];
                            const beh = inventoryLookup["Behältnis"] && inventoryLookup["Behältnis"][r.BehaelterID];
                            const docht = inventoryLookup["Docht"] && inventoryLookup["Docht"][r.DochtID];
                            return (
                                <tr
                                    key={r.RezeptKerzeID}
                                    className="border-b hover:bg-gray-100 cursor-pointer"
                                    onClick={() => openModalForRecipe(r, "Kerze")}
                                >
                                    <td className="p-4">{r.RezeptKerzeID}</td>
                                    <td className="p-4">{r.Name}</td>
                                    <td className="p-4">{invMat ? invMat.Materialname : r.Name_Mat}</td>
                                    <td className="p-4">{beh ? beh.Behaeltername : r.Behaelter_name}</td>
                                    <td className="p-4">{docht ? docht.Dochtname : r.Docht_name}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                {/* Tabelle SprayDiff */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">SprayDiff (Diffusor/Raumspray)</h2>
                    <table className="table-auto w-full bg-white shadow-lg rounded-lg mb-4">
                        <thead>
                        <tr className="border-b bg-gray-200 text-gray-800">
                            <th className="p-4 text-left font-semibold">Rezept-ID</th>
                            <th className="p-4 text-left font-semibold">Name</th>
                            <th className="p-4 text-left font-semibold">Behälter</th>
                            <th className="p-4 text-left font-semibold">Zwischenprodukt 1</th>
                            <th className="p-4 text-left font-semibold">Zwischenprodukt 2</th>
                        </tr>
                        </thead>
                        <tbody>
                        {uniqueSprayDiff.map((r: any) => (
                            <tr
                                key={r.RezeptSprayDifID}
                                className="border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => openModalForRecipe(r, "SprayDiff")}
                            >
                                <td className="p-4">{r.RezeptSprayDifID}</td>
                                <td className="p-4">{r.Name}</td>
                                <td className="p-4">{r.Behaelter_name}</td>
                                <td className="p-4">{r.ZP_name1}</td>
                                <td className="p-4">{r.ZP_name2}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                {/* Tabelle ZP */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Zwischenprodukt</h2>
                    <table className="table-auto w-full bg-white shadow-lg rounded-lg mb-4">
                        <thead>
                        <tr className="border-b bg-gray-200 text-gray-800">
                            <th className="p-4 text-left font-semibold">Rezept-ID</th>
                            <th className="p-4 text-left font-semibold">Name</th>
                            <th className="p-4 text-left font-semibold">Beschreibung</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recipes.ZP.map((r: any) => (
                            <tr
                                key={r.ZPRezeptID}
                                className="border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => openModalForRecipe(r, "ZP")}
                            >
                                <td className="p-4">{r.ZPRezeptID}</td>
                                <td className="p-4">{r.Name}</td>
                                <td className="p-4">{r.Beschreibung}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal zum Bearbeiten */}
            {showModal && selectedRecipe.recipe && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">{selectedRecipe.type} bearbeiten</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1">Name</label>
                                <input
                                    type="text"
                                    name="Name"
                                    value={formData.Name || ""}
                                    onChange={handleFormInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                            </div>
                            {selectedRecipe.type === "ZP" ? (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-1">Beschreibung</label>
                                        <textarea
                                            name="Beschreibung"
                                            value={formData.Beschreibung || ""}
                                            onChange={handleFormInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">Releasedate</label>
                                        <input
                                            type="date"
                                            name="Releasedate"
                                            value={formatDateForInput(formData.Releasedate)}
                                            readOnly
                                            className="w-full border px-3 py-2 rounded bg-gray-200"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">Changedate</label>
                                        <input
                                            type="date"
                                            name="Changedate"
                                            value={formatDateForInput(formData.Changedate)}
                                            readOnly
                                            className="w-full border px-3 py-2 rounded bg-gray-200"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold">
                                            Zutaten hinzufügen (Summe max. 100)
                                        </label>
                                        {formData.ZPItems && formData.ZPItems.length > 0 ? (
                                            formData.ZPItems.map((item: any, index: number) => (
                                                <div key={index} className="flex gap-2 mb-2 items-center">
                                                    <select
                                                        name={`ZPItems[${index}].productId`}
                                                        value={item.productId || ""}
                                                        onChange={(e) => handleZPItemChange(index, "productId", e.target.value)}
                                                        className="w-1/2 border px-3 py-2 rounded"
                                                        required
                                                    >
                                                        <option value="">Zutat wählen</option>
                                                        {combinedZPOptions.map((zp) => (
                                                            <option key={zp.id} value={zp.id}>
                                                                {zp.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="number"
                                                        name={`ZPItems[${index}].quantity`}
                                                        value={item.quantity || ""}
                                                        onChange={(e) => handleZPItemChange(index, "quantity", e.target.value)}
                                                        placeholder="Verhältnis (%)"
                                                        className="w-1/2 border px-3 py-2 rounded"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeZPItem(index)}
                                                        className="text-red-500"
                                                    >
                                                        Entfernen
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-600 mb-2">Keine Zutaten hinzugefügt.</div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={addZPItem}
                                            className="px-3 py-1 bg-green-500 text-white rounded"
                                        >
                                            Zutat hinzufügen
                                        </button>
                                    </div>
                                </>
                            ) : selectedRecipe.type === "Kerze" ? (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-1">Material</label>
                                        <select
                                            name="MatID"
                                            value={formData.MatID || ""}
                                            onChange={handleFormInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        >
                                            <option value="">Material wählen</option>
                                            {materialsOptions.map((mat) => (
                                                <option key={mat.MatID} value={mat.MatID}>
                                                    {mat.Materialname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">Behälter</label>
                                        <select
                                            name="BehaelterID"
                                            value={formData.BehaelterID || ""}
                                            onChange={handleFormInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        >
                                            <option value="">Behälter wählen</option>
                                            {behOptions.map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.Materialname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">Deckel (optional)</label>
                                        <select
                                            name="DeckelID"
                                            value={formData.DeckelID || ""}
                                            onChange={handleFormInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                        >
                                            <option value="">Deckel wählen</option>
                                            {deckelOptions.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.Deckelname || d.Materialname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">Docht</label>
                                        <select
                                            name="DochtID"
                                            value={formData.DochtID || ""}
                                            onChange={handleFormInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        >
                                            <option value="">Docht wählen</option>
                                            {dochtOptions.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.Dochtname || d.Materialname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">WarnEtt</label>
                                        <select
                                            name="WarnEttID"
                                            value={formData.WarnEttID || ""}
                                            onChange={handleFormInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        >
                                            <option value="">WarnEtt wählen</option>
                                            {warnEttOptions.map((w) => (
                                                <option key={w.id} value={w.id}>
                                                    {w.Materialname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">Zwischenprodukt</label>
                                        <select
                                            name="ZPRezeptID"
                                            value={formData.ZPRezeptID || ""}
                                            onChange={handleFormInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        >
                                            <option value="">Zwischenprodukt wählen</option>
                                            {combinedZPOptions.map((zp) => (
                                                <option key={zp.id} value={zp.id}>
                                                    {zp.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : selectedRecipe.type === "SprayDiff" && (
                                <>
                                    <div className="mb-4">
                                        <label className="block mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="Name"
                                            value={formData.Name || ""}
                                            onChange={handleFormInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">Behälter</label>
                                        <select
                                            name="BehaelterID"
                                            value={formData.BehaelterID || ""}
                                            onChange={handleFormInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        >
                                            <option value="">Behälter wählen</option>
                                            {behOptions.map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.Materialname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">Deckel (optional)</label>
                                        <select
                                            name="DeckelID"
                                            value={formData.DeckelID || ""}
                                            onChange={handleFormInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                        >
                                            <option value="">Deckel wählen</option>
                                            {deckelOptions.map((d) => (
                                                <option key={d.id} value={d.id}>
                                                    {d.Deckelname || d.Materialname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1">WarnEtt</label>
                                        <select
                                            name="WarnEttID"
                                            value={formData.WarnEttID || ""}
                                            onChange={handleFormInputChange}
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        >
                                            <option value="">WarnEtt wählen</option>
                                            {warnEttOptions.map((w) => (
                                                <option key={w.id} value={w.id}>
                                                    {w.Materialname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold">Zwischenprodukt 1</label>
                                        <div className="flex gap-2">
                                            <select
                                                name="ZPRezeptID1"
                                                value={formData.ZPRezeptID1 || ""}
                                                onChange={handleFormInputChange}
                                                className="w-1/2 border px-3 py-2 rounded"
                                                required
                                            >
                                                <option value="">Zwischenprodukt wählen</option>
                                                {combinedZPOptions.map((zp) => (
                                                    <option key={zp.id} value={zp.id}>
                                                        {zp.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1 font-semibold">Zwischenprodukt 2</label>
                                        <div className="flex gap-2">
                                            <select
                                                name="ZPRezeptID2"
                                                value={formData.ZPRezeptID2 || ""}
                                                onChange={handleFormInputChange}
                                                className="w-1/2 border px-3 py-2 rounded"
                                                required
                                            >
                                                <option value="">Zwischenprodukt wählen</option>
                                                {combinedZPOptions.map((zp) => (
                                                    <option key={zp.id} value={zp.id}>
                                                        {zp.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
                                    Abbrechen
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                                    Speichern
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeOverviewPage;
