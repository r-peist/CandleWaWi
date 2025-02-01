"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaPlus } from "react-icons/fa";

// Dummy‑Rezepte (entsprechend der Tabelle "zwischenproduktrezept")
const dummyRecipes = [
    {
        ZPRezeptID: 1,
        Name: "Duftmische1",
        Beschreibung: "Joar is ne Mische ne",
        Erstellungsdatum: "2024-11-27",
        Aenderungsdatum: "2024-11-27",
    },
    {
        ZPRezeptID: 2,
        Name: "NurÖl1",
        Beschreibung: "junge junge ganz schön viel Öl",
        Erstellungsdatum: "1990-08-27",
        Aenderungsdatum: "2024-11-27",
    },
    {
        ZPRezeptID: 3,
        Name: "Mische1DifSpray",
        Beschreibung: "Mischmasch wischwasch",
        Erstellungsdatum: "1999-09-11",
        Aenderungsdatum: "2024-12-28",
    },
];

const RecipeOverviewPage = () => {
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        // Hier werden die Dummy-Daten simuliert – später durch einen API-Aufruf ersetzen!
        setRecipes(dummyRecipes);
    }, []);

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
            <section>
                <table className="table-auto w-full bg-white shadow-lg rounded-lg">
                    <thead>
                    <tr className="border-b bg-gray-200 text-gray-800">
                        <th className="p-4 text-left font-semibold">Rezept-ID</th>
                        <th className="p-4 text-left font-semibold">Name</th>
                        <th className="p-4 text-left font-semibold">Beschreibung</th>
                        <th className="p-4 text-left font-semibold">Erstellt</th>
                        <th className="p-4 text-left font-semibold">Geändert</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                            <tr
                                key={recipe.ZPRezeptID}
                                className="border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                    router.push(`/recipes/${recipe.ZPRezeptID}`)
                                }
                            >
                                <td className="p-4">{recipe.ZPRezeptID}</td>
                                <td className="p-4">{recipe.Name}</td>
                                <td className="p-4">{recipe.Beschreibung}</td>
                                <td className="p-4">{recipe.Erstellungsdatum}</td>
                                <td className="p-4">{recipe.Aenderungsdatum}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-4 text-center text-gray-600" colSpan="5">
                                Keine Rezepte gefunden.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default RecipeOverviewPage;
