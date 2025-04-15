"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { useUser } from '@auth0/nextjs-auth0/client';

// Dummy‑Liste der verfügbaren Materialien
const materials = [
  { id: 1, name: "Wachs_Soja_40.000g" },
  { id: 2, name: "Wachs_Soja_60.000g" },
  { id: 3, name: "Glas_Braun_180ml" },
  { id: 4, name: "Holzdeckel_Braun" },
  // ... weitere Materialien
];

const NewRecipePage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();

  const [formData, setFormData] = useState({
    Name: "",
    Beschreibung: "",
    Releasedate: "",
    Changedate: "",
    Zutaten: [],
  });

  const [ingredient, setIngredient] = useState({ MatID: "", Menge: "" });
  const [error, setError] = useState("");

  // 🔐 Redirect wenn nicht eingeloggt
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/unauthorized");
    }
  }, [isLoading, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIngredient((prev) => ({ ...prev, [name]: value }));
  };

  const addIngredient = () => {
    if (!ingredient.MatID || !ingredient.Menge) return;
    setFormData((prev) => ({
      ...prev,
      Zutaten: [
        ...prev.Zutaten,
        {
          MatID: parseInt(ingredient.MatID, 10),
          Menge: parseInt(ingredient.Menge, 10),
        },
      ],
    }));
    setIngredient({ MatID: "", Menge: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      Rezept: {
        ZP: {
          Name: formData.Name,
          Beschreibung: formData.Beschreibung,
          Releasedate: new Date(formData.Releasedate).toISOString(),
          Changedate: new Date(formData.Changedate).toISOString(),
          Zutaten: formData.Zutaten,
        },
      },
    };

    try {
      const res = await fetch("/api/rezept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Fehler: ${res.status}`);
      const result = await res.json();
      alert(result.Updated?.message || "Rezept erstellt!");
      router.push("/recipes");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.push("/recipes")}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 flex items-center gap-2"
        >
          <FaArrowLeft /> Zurück
        </button>
        <h1 className="text-3xl font-bold">Neues Rezept anlegen</h1>
      </header>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Beschreibung</label>
          <textarea
            name="Beschreibung"
            value={formData.Beschreibung}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Erstellt</label>
          <input
            type="date"
            name="Releasedate"
            value={formData.Releasedate}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Geändert</label>
          <input
            type="date"
            name="Changedate"
            value={formData.Changedate}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Zutaten</label>
          <div className="flex gap-2 mb-2">
            <select
              name="MatID"
              value={ingredient.MatID}
              onChange={handleIngredientChange}
              className="border px-3 py-2 rounded w-1/2"
              required
            >
              <option value="">Material wählen</option>
              {materials.map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="Menge"
              value={ingredient.Menge}
              onChange={handleIngredientChange}
              placeholder="Menge"
              className="border px-3 py-2 rounded w-1/2"
              required
            />
            <button
              type="button"
              onClick={addIngredient}
              className="px-3 py-2 bg-green-500 text-white rounded"
            >
              +
            </button>
          </div>

          {formData.Zutaten.length > 0 && (
            <ul className="list-disc pl-5">
              {formData.Zutaten.map((zutat, index) => {
                const material = materials.find((m) => m.id === zutat.MatID);
                return (
                  <li key={index}>
                    {material ? material.name : "Unbekannt"} – Menge: {zutat.Menge}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/recipes")}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Abbrechen
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Rezept anlegen
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRecipePage;
