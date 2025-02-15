"use client";
import React, { useState, useEffect, useMemo } from "react";
import { IoMdClose } from "react-icons/io";
import {FaArrowLeft, FaEdit, FaPlus} from "react-icons/fa";
import { useRouter } from "next/navigation";

// Rezeptdaten abrufen
const fetchRecipes = async () => {
    const res = await fetch("/api/rezept", { cache: "no-store" });
    if (!res.ok) throw new Error(`Fehler: ${res.status}`);
    return await res.json();
};

// Inventardaten abrufen
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
    const [recipes, setRecipes] = useState({ Kerze: [], SprayDiff: [], ZP: [] });
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Kerze");
    const [showModal, setShowModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState({ recipe: null, type: "" });
    const [formData, setFormData] = useState({});
    const [inventoryOptions, setInventoryOptions] = useState([]);

    // Hilfsfunktionen für Datum
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
    };

    // Rezeptdaten laden
    const loadRecipes = async () => {
        try {
            const data = await fetchRecipes();
            setRecipes({
                Kerze: data.Kerze || [],
                SprayDiff: data.SprayDiff || [],
                ZP: data.ZP || [],
            });
        } catch (err) {
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
            // data: Array von Gruppen, z. B. { Kategorie: "Wachs", Materialien: [ {...}, ... ] }
            const flat = data.reduce((acc, group) => {
                if (Array.isArray(group.Materialien)) {
                    const items = group.Materialien.map(item => ({
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

    // Lookup-Tabelle: Erstelle ein Objekt, in dem für jede Kategorie die Items per MatID abgelegt werden
    const inventoryLookup = useMemo(() => {
        return inventoryOptions.reduce((acc, item) => {
            const cat = item.MaterialKategorie;
            if (!acc[cat]) acc[cat] = {};
            acc[cat][item.MatID] = item;
            return acc;
        }, {});
    }, [inventoryOptions]);

    // Logge das kombinierte Mapping (Rezepte und Inventardaten) zur Kontrolle
    useEffect(() => {
        if (recipes.Kerze.length > 0) {
            const combined = recipes.Kerze.map(r => {
                return {
                    RezeptID: r.RezeptKerzeID,
                    Name: r.Name,
                    // Für Wachs: Lookup in der Kategorie "Wachs"
                    Material: inventoryLookup["Wachs"] && inventoryLookup["Wachs"][r.MatID]
                        ? inventoryLookup["Wachs"][r.MatID].Materialname
                        : r.Name_Mat,
                    // Für Behälter: Lookup in der Kategorie "Behältnis"
                    Behälter: inventoryLookup["Behältnis"] && inventoryLookup["Behältnis"][r.BehaelterID]
                        ? inventoryLookup["Behältnis"][r.BehaelterID].Materialname
                        : r.Behaelter_name,
                    // Für Docht: Lookup in der Kategorie "Docht"
                    Docht: inventoryLookup["Docht"] && inventoryLookup["Docht"][r.DochtID]
                        ? inventoryLookup["Docht"][r.DochtID].Materialname
                        : r.Docht_name
                };
            });
            console.log("Kombinierte Mapping-Tabelle (Kerze):", combined);
        }
    }, [recipes, inventoryLookup]);

    // Dropdown-Optionen basierend auf Inventardaten
    const materialsOptions = inventoryOptions.filter(
        (item) => item.MaterialKategorie === "Wachs"
    );
    const behOptions = inventoryOptions.filter(
        (item) => item.MaterialKategorie === "Behältnis"
    );
    const deckelOptions = inventoryOptions.filter(
        (item) => item.MaterialKategorie === "Deckel"
    );
    const dochtOptions = inventoryOptions.filter(
        (item) => item.MaterialKategorie === "Docht"
    );
    const warnEttOptions = inventoryOptions.filter(
        (item) =>
            item.MaterialKategorie === "WarnEtikett" ||
            item.MaterialKategorie.toLowerCase() === "warnetikett"
    );
    // Für Zwischenprodukte: Aus Inventar (Gemisch, Öl) und aus Rezept-ZP
    const inventoryZPOptions = inventoryOptions
        .filter(
            (item) =>
                item.MaterialKategorie === "Gemisch" || item.MaterialKategorie === "Öl"
        )
        .map(item => ({
            id: item.MatID,
            name: item.Materialname
        }));
    const recipeZPOptions = (recipes.ZP || []).map(zp => ({
        id: zp.ZPRezeptID,
        name: zp.Name
    }));
    const combinedZPOptions = useMemo(() => {
        const all = [...recipeZPOptions, ...inventoryZPOptions];
        const unique = Array.from(new Map(all.map(opt => [opt.id, opt])).values());
        return unique;
    }, [recipeZPOptions, inventoryZPOptions]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    // Beim Öffnen des Modals werden die aktuellen Rezeptdaten als Default-Werte gesetzt
    const openModalForRecipe = (recipe, type) => {
        setSelectedRecipe({ recipe, type });
        if (type === "ZP") {
            setFormData({
                Name: recipe.Name || "",
                Beschreibung: recipe.Beschreibung || "",
                Releasedate: recipe.Releasedate || "",
                Changedate: recipe.Changedate || "",
                ZPRezeptID: recipe.ZPRezeptID || "",
                ZPItems: recipe.Zutaten || []
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
                ZPRezeptID: recipe.ZPRezeptID || ""
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRecipe({ recipe: null, type: "" });
    };

    const handleFormInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleZPItemChange = (index, field, value) => {
        const newItems = formData.ZPItems ? [...formData.ZPItems] : [];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData(prev => ({ ...prev, ZPItems: newItems }));
    };

    const addZPItem = () => {
        const newItems = formData.ZPItems ? [...formData.ZPItems] : [];
        newItems.push({ productId: "", quantity: "" });
        setFormData(prev => ({ ...prev, ZPItems: newItems }));
    };

    const removeZPItem = (index) => {
        const newItems = formData.ZPItems.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, ZPItems: newItems }));
    };

    // Hier wird der Update-Payload aufgebaut – es werden ausschließlich Updates durchgeführt.
    // Dabei werden die IDs aus dem Formular übernommen (z. B. BehälterID, DochtID usw.)
    // (Hinweis: Die Feldnamen und Werte werden exakt so gesendet, wie im Beispiel gefordert.)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedRecipe.type === "ZP" && formData.ZPItems) {
            const sum = formData.ZPItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0);
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
                        Changedate: formData.Changedate || "",
                        Zutaten: formData.ZPItems,
                    },
                },
            };
        } else if (selectedRecipe.type === "Kerze") {
            const selectedMaterial = materialsOptions.find(
                (item) => Number(item.MatID) === Number(formData.MatID)
            ) || {};
            const selectedBeh = behOptions.find(
                (item) => Number(item.MatID) === Number(formData.BehaelterID)
            ) || {};
            const selectedDeckel = deckelOptions.find(
                (item) => Number(item.MatID) === Number(formData.DeckelID)
            ) || {};
            const selectedDocht = dochtOptions.find(
                (item) => Number(item.MatID) === Number(formData.DochtID)
            ) || {};
            const selectedZP = combinedZPOptions.find(
                (item) => Number(item.id) === Number(formData.ZPRezeptID)
            ) || {};
            payload = {
                Rezept: {
                    Kerze: {
                        RezeptKerzeID: Number(formData.RezeptKerzeID),
                        Name: formData.Name,
                        MatID: Number(formData.MatID),
                        Name_Mat: selectedMaterial.Materialname || "",
                        BehaelterID: Number(formData.BehaelterID),
                        Behaelter_name: selectedBeh.Materialname || "",
                        DeckelID: formData.DeckelID ? Number(formData.DeckelID) : 0,
                        Deckel_name: formData.DeckelID ? (selectedDeckel.Materialname || "") : "",
                        DochtID: Number(formData.DochtID),
                        Docht_name: selectedDocht.Materialname || "",
                        // Laut Schema muss WarnEtt immer 1 sein
                        WarnEttID: 1,
                        WarnEtt_name: "WarnungKerze",
                        ZPRezeptID: Number(formData.ZPRezeptID),
                        ZP_name: selectedZP.name || ""
                    },
                },
            };
        } else if (selectedRecipe.type === "SprayDiff") {
            const selectedBeh = behOptions.find(
                (item) => Number(item.MatID) === Number(formData.BehaelterID)
            ) || {};
            const selectedDeckel = deckelOptions.find(
                (item) => Number(item.MatID) === Number(formData.DeckelID)
            ) || {};
            const selectedZP1 = combinedZPOptions.find(
                (item) => Number(item.id) === Number(formData.ZPRezeptID1)
            ) || {};
            const selectedZP2 = combinedZPOptions.find(
                (item) => Number(item.id) === Number(formData.ZPRezeptID2)
            ) || {};
            payload = {
                Rezept: {
                    SprayDiff: {
                        RezeptSprayDifID: Number(formData.RezeptSprayDifID),
                        Name: formData.Name,
                        BehaelterID: Number(formData.BehaelterID),
                        Behaelter_name: selectedBeh.Materialname || "",
                        DeckelID: Number(formData.DeckelID),
                        Deckel_name: selectedDeckel.Materialname || "",
                        WarnEttID: 1,
                        WarnEtt_name: "WarnungDifSpray",
                        ZPRezeptID1: Number(formData.ZPRezeptID1),
                        ZP_name1: selectedZP1.name || "",
                        ZPRezeptID2: Number(formData.ZPRezeptID2),
                        ZP_name2: selectedZP2.name || ""
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
        } catch (err) {
            alert("Fehler beim Speichern: " + err.message);
        }
    };

    const renderTableHead = () => {
        if (selectedCategory === "Kerze") {
            return (
                <tr className="border-b bg-gray-200 text-gray-800">
                    <th className="p-4 text-left font-semibold">Rezept-ID</th>
                    <th className="p-4 text-left font-semibold">Name</th>
                    <th className="p-4 text-left font-semibold">Material</th>
                    <th className="p-4 text-left font-semibold">Behälter</th>
                    <th className="p-4 text-left font-semibold">Docht</th>
                </tr>
            );
        }
        if (selectedCategory === "SprayDiff") {
            return (
                <tr className="border-b bg-gray-200 text-gray-800">
                    <th className="p-4 text-left font-semibold">Rezept-ID</th>
                    <th className="p-4 text-left font-semibold">Name</th>
                    <th className="p-4 text-left font-semibold">Behälter</th>
                    <th className="p-4 text-left font-semibold">Zwischenprodukt 1</th>
                    <th className="p-4 text-left font-semibold">Zwischenprodukt 2</th>
                </tr>
            );
        }
        if (selectedCategory === "ZP") {
            return (
                <tr className="border-b bg-gray-200 text-gray-800">
                    <th className="p-4 text-left font-semibold">Rezept-ID</th>
                    <th className="p-4 text-left font-semibold">Name</th>
                    <th className="p-4 text-left font-semibold">Beschreibung</th>
                </tr>
            );
        }
    };

    const renderTableBody = () => {
        if (selectedCategory === "Kerze") {
            return recipes.Kerze.map((r) => {
                const invMat = inventoryOptions.find(
                    (item) => Number(item.MatID) === Number(r.MatID)
                );
                return (
                    <tr
                        key={r.RezeptKerzeID}
                        className="border-b hover:bg-gray-100 cursor-pointer"
                        onClick={() => openModalForRecipe(r, "Kerze")}
                    >
                        <td className="p-4">{r.RezeptKerzeID}</td>
                        <td className="p-4">{r.Name}</td>
                        <td className="p-4">{invMat ? invMat.Materialname : r.Name_Mat}</td>
                        <td className="p-4">{r.Behaelter_name}</td>
                        <td className="p-4">{r.Docht_name}</td>
                    </tr>
                );
            });
        }
        if (selectedCategory === "SprayDiff") {
            return recipes.SprayDiff.map((r) => (
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
            ));
        }
        if (selectedCategory === "ZP") {
            return recipes.ZP.map((r) => (
                <tr
                    key={r.ZPRezeptID}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => openModalForRecipe(r, "ZP")}
                >
                    <td className="p-4">{r.ZPRezeptID}</td>
                    <td className="p-4">{r.Name}</td>
                    <td className="p-4">{r.Beschreibung}</td>
                </tr>
            ));
        }
    };

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

            <div className="mb-4">
                <label className="block mb-1 font-semibold">Kategorie auswählen</label>
                <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="border px-3 py-2 rounded"
                >
                    <option value="Kerze">Kerze</option>
                    <option value="SprayDiff">SprayDiff (Diffusor/Raumspray)</option>
                    <option value="ZP">Zwischenprodukt</option>
                </select>
            </div>

            <section>
                <table className="table-auto w-full bg-white shadow-lg rounded-lg">
                    <thead>{renderTableHead()}</thead>
                    <tbody>{renderTableBody()}</tbody>
                </table>
            </section>

            {showModal && selectedRecipe.recipe && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            {selectedRecipe.type} bearbeiten
                        </h2>
                        <form onSubmit={handleSubmit}>
                            {/* Gemeinsames Feld: Name */}
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
                                        <label className="block mb-1 font-semibold">
                                            Zutaten hinzufügen (Summe max. 100)
                                        </label>
                                        {formData.ZPItems && formData.ZPItems.length > 0 ? (
                                            formData.ZPItems.map((item, index) => (
                                                <div key={index} className="flex gap-2 mb-2 items-center">
                                                    <select
                                                        name={`ZPItems[${index}].productId`}
                                                        value={item.productId || ""}
                                                        onChange={(e) =>
                                                            handleZPItemChange(index, "productId", e.target.value)
                                                        }
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
                                                        onChange={(e) =>
                                                            handleZPItemChange(index, "quantity", e.target.value)
                                                        }
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
                                            <div className="text-gray-600 mb-2">
                                                Keine Zutaten hinzugefügt.
                                            </div>
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
                                                <option key={b.MatID} value={b.MatID}>
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
                                                <option key={d.MatID} value={d.MatID}>
                                                    {d.Materialname}
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
                                                <option key={d.MatID} value={d.MatID}>
                                                    {d.Materialname}
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
                                                <option key={w.MatID} value={w.MatID}>
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
                                                <option key={b.MatID} value={b.MatID}>
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
                                                <option key={d.MatID} value={d.MatID}>
                                                    {d.Materialname}
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
                                                <option key={w.MatID} value={w.MatID}>
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
                                            <input
                                                type="number"
                                                name="Menge_ZP1"
                                                value={formData.Menge_ZP1 || ""}
                                                onChange={handleFormInputChange}
                                                placeholder="Menge (optional)"
                                                className="w-1/2 border px-3 py-2 rounded"
                                            />
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
                                            <input
                                                type="number"
                                                name="Menge_ZP2"
                                                value={formData.Menge_ZP2 || ""}
                                                onChange={handleFormInputChange}
                                                placeholder="Menge (optional)"
                                                className="w-1/2 border px-3 py-2 rounded"
                                            />
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
