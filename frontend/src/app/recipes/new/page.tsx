"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaSave, FaPlus, FaTrash } from "react-icons/fa";

// Dummy-Materialien (für die Zutaten-Auswahl)
const dummyMaterials = [
    { MatID: 1, Name: "Wachs_Soja_40.000g" },
    { MatID: 2, Name: "Wachs_Soja_60.000g" },
    { MatID: 3, Name: "Glas_Braun_180ml" },
    { MatID: 4, Name: "Glas_Schwarz_300ml" },
    { MatID: 5, Name: "Glas_Weiß_300ml" },
    // Weitere Materialien können ergänzt werden
];

const NewRecipePage = () => {
    const router = useRouter();
    const [recipeName, setRecipeName] = useState("");
    const [description, setDescription] = useState("");
    const [ingredients, setIngredients] = useState([{ MatID: "", Menge: "" }]);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { MatID: "", Menge: "" }]);
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = ingredients.map((ing, i) => {
            if (i === index) {
                return { ...ing, [field]: value };
            }
            return ing;
        });
        setIngredients(updatedIngredients);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Zusammenstellen des Payloads für das neue Rezept:
        const payload = {
            Name: recipeName,
            Beschreibung: description,
            Erstellungsdatum: new Date().toISOString().split("T")[0],
            Zutaten: ingredients, // Array mit { MatID, Menge }
        };
        console.log("New Recipe Payload:", payload);
        // Hier erfolgt später der POST-Request an /api/recipes
        router.push("/recipes");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8 flex justify-between items-center">
                <button
                    onClick={() => router.push("/recipes")}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 flex items-center gap-2"
                >
                    <FaArrowLeft /> Zurück
                </button>
                <h1 className="text-3xl font-bold">Neues Rezept anlegen</h1>
            </header>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
                <div className="mb-4">
                    <label className="block text-gray-700">Rezeptname</label>
                    <input
                        type="text"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Beschreibung</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Zutaten</h2>
                    {ingredients.map((ing, index) => (
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
                        <FaSave /> Rezept anlegen
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewRecipePage;
