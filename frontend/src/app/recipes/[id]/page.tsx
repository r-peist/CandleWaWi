"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft, FaSave, FaPlus, FaTrash } from "react-icons/fa";

// Dummy‑Rezepte (wie in der Übersicht)
const dummyRecipes = [
    {
        ZPRezeptID: 1,
        Name: "Duftmische1",
        Beschreibung: "Joar is ne Mische ne",
        Erstellungsdatum: "2024-11-27",
        Aenderungsdatum: "2024-11-27",
        Zutaten: [
            { MatID: 1, Menge: 40 },
            { MatID: 2, Menge: 60 },
        ],
    },
    // Weitere Dummy‑Rezepte können ergänzt werden
];

// Dummy‑Materialien (für Zutaten)
const dummyMaterials = [
    { MatID: 1, Name: "Wachs_Soja_40.000g" },
    { MatID: 2, Name: "Wachs_Soja_60.000g" },
    { MatID: 3, Name: "Glas_Braun_180ml" },
    { MatID: 4, Name: "Glas_Schwarz_300ml" },
    { MatID: 5, Name: "Glas_Weiß_300ml" },
];

const RecipeDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const recipeId = parseInt(params.id, 10);

    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        // Simuliere das Laden des Rezepts anhand der ID
        const found = dummyRecipes.find(
            (r) => r.ZPRezeptID === recipeId
        );
        setRecipe(found);
    }, [recipeId]);

    // Zutaten bearbeiten
    const handleAddIngredient = () => {
        setRecipe((prev) => ({
            ...prev,
            Zutaten: [...prev.Zutaten, { MatID: "", Menge: "" }],
        }));
    };

    const handleRemoveIngredient = (index) => {
        setRecipe((prev) => ({
            ...prev,
            Zutaten: prev.Zutaten.filter((_, i) => i !== index),
        }));
    };

    const handleIngredientChange = (index, field, value) => {
        setRecipe((prev) => {
            const updatedZutaten = prev.Zutaten.map((ing, i) =>
                i === index ? { ...ing, [field]: value } : ing
            );
            return { ...prev, Zutaten: updatedZutaten };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Zusammenstellen des Payloads für die Rezeptaktualisierung:
        console.log("Updated Recipe Payload:", recipe);
        // Hier erfolgt später ein PUT-Request an /api/recipes/:id
        router.push("/recipes");
    };

    if (!recipe) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <p>Rezept wird geladen...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8 flex justify-between items-center">
                <button
                    onClick={() => router.push("/recipes")}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 flex items-center gap-2"
                >
                    <FaArrowLeft /> Zurück
                </button>
                <h1 className="text-3xl font-bold">Rezept bearbeiten</h1>
            </header>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
                <div className="mb-4">
                    <label className="block text-gray-700">Rezeptname</label>
                    <input
                        type="text"
                        value={recipe.Name}
                        onChange={(e) =>
                            setRecipe({ ...recipe, Name: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Beschreibung</label>
                    <textarea
                        value={recipe.Beschreibung}
                        onChange={(e) =>
                            setRecipe({ ...recipe, Beschreibung: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Zutaten</h2>
                    {recipe.Zutaten.map((ing, index) => (
                        <div key={index} className="flex gap-4 items-center mb-2">
                            <select
                                value={ing.MatID}
                                onChange={(e) =>
                                    handleIngredientChange(index, "MatID", e.target.value)
                                }
                                className="px-4 py-2 border rounded"
                                required
                            >
                                <option value="">-- Material wählen --</option>
                                {dummyMaterials.map((mat) => (
                                    <option key={mat.MatID} value={mat.MatID}>
                                        {mat.Name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                value={ing.Menge}
                                onChange={(e) =>
                                    handleIngredientChange(index, "Menge", e.target.value)
                                }
                                className="w-24 px-4 py-2 border rounded"
                                placeholder="Menge"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveIngredient(index)}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                    >
                        <FaPlus /> Zutat hinzufügen
                    </button>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
                    >
                        <FaSave /> Änderungen speichern
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecipeDetailPage;
