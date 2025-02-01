// File: app/production/herstellung-produkt/page.tsx (HerstellungProduktPage)
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const HerstellungProduktPage = () => {
    const router = useRouter();
    const [selectedRecipe, setSelectedRecipe] = useState("");
    const [materialAvailable, setMaterialAvailable] = useState("");
    const [alternative, setAlternative] = useState("");
    const [processCompleted, setProcessCompleted] = useState(false);

    // Dummy-Rezeptliste
    const dummyRecipes = [
        { id: 1, name: "Rezept A" },
        { id: 2, name: "Rezept B" },
        { id: 3, name: "Rezept C" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (materialAvailable === "ja") {
            console.log(
                "Material verfügbar – Materialien werden zusammengestellt, Produkt wird hergestellt und Material aktualisiert."
            );
        } else {
            console.log(
                `Material nicht verfügbar – Alternative: ${alternative}. Danach wird das Produkt hergestellt.`
            );
        }
        setProcessCompleted(true);
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
                <h1 className="text-3xl font-bold">Herstellung eines Produkts</h1>
            </header>
            {processCompleted ? (
                <div className="bg-white p-8 rounded shadow">
                    <p>Produkt wurde hergestellt!</p>
                    <button
                        onClick={() => router.push("/production")}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Zurück zur Produktion
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
                    <div className="mb-4">
                        <label className="block text-gray-700">Rezept auswählen</label>
                        <select
                            value={selectedRecipe}
                            onChange={(e) => setSelectedRecipe(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        >
                            <option value="">-- Auswahl --</option>
                            {dummyRecipes.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Material verfügbar?</label>
                        <select
                            value={materialAvailable}
                            onChange={(e) => setMaterialAvailable(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                            required
                        >
                            <option value="">-- Auswahl --</option>
                            <option value="ja">Ja</option>
                            <option value="nein">Nein</option>
                        </select>
                    </div>
                    {materialAvailable === "nein" && (
                        <div className="mb-4">
                            <label className="block text-gray-700">Alternative wählen</label>
                            <select
                                value={alternative}
                                onChange={(e) => setAlternative(e.target.value)}
                                className="w-full px-4 py-2 border rounded"
                                required
                            >
                                <option value="">-- Auswahl --</option>
                                <option value="einkaufen">Materialien einkaufen</option>
                                <option value="umlagern">Materialien umlagern</option>
                            </select>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2"
                    >
                        <FaSave /> Produkt herstellen
                    </button>
                </form>
            )}
        </div>
    );
};

export default HerstellungProduktPage;
