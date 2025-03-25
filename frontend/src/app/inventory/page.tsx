"use client";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Omars Änderungen
import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';

const fetchInventory = async () => {
    try {
        const response = await fetch("/api/inventory", { method: "GET" });
        if (!response.ok) {
            throw new Error("Fehler beim Abrufen des Inventars");
        }
        const inventar = await response.json();
        return inventar; // Das Array von Inventar-Daten
    } catch (error) {
        console.error("Fehler beim Laden des Inventars:", error);
        return [];
    }
};

const InventoryPage = () => {

    // Omars Änderungen
    const { user, isLoading } = useUser();
    // Omars Änderungen Ende
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [formData, setFormData] = useState({ quantity: "", comment: "" });
    const router = useRouter();

    //Omar Änderungen
    // Authentifizierung überprüfen
    useEffect(() => {
        if (!isLoading && !user) {
            redirect('/');
        }
    }, [isLoading, user ]);


    // Inventar laden
    useEffect(() => {
        const loadInventory = async () => {
            const data = await fetchInventory();
            setInventory(data);
        };
        loadInventory();
    }, []);

    const filteredInventory = inventory.filter((item) =>
        item.Material.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const closeModal = () => {
        setSelectedMaterial(null);
        setEditingField(null);
        setFormData({ quantity: "", comment: "" });
    };

    const handleEdit = (field) => {
        setEditingField(field);
        if (field === "quantity") {
            setFormData({ ...formData, quantity: selectedMaterial.Menge });
        }
    };

    const handleSave = () => {
        if (editingField === "quantity") {
            const newQuantity = parseInt(formData.quantity, 10);
            if (newQuantity < selectedMaterial.Menge && !formData.comment) {
                alert("Ein Kommentar ist erforderlich, wenn die Menge reduziert wird.");
                return;
            }
            console.log("Menge aktualisiert:", { Material: selectedMaterial.Material, Menge: newQuantity });
        }
        closeModal();
    };

    // Omars Änderungen
    // Authentifizierung überprüfen
    useEffect(() => {
        if (!isLoading && !user) {
            redirect('/');
        }
    }, [isLoading, user ]);

    
    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col">
            <header className="mb-8 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow flex items-center space-x-2"
                        onClick={() => router.push("/")}
                    >
                        <FaArrowLeft size={16} />
                        <span>Zurück</span>
                    </button>
                    <h1 className="text-3xl font-bold">Inventar</h1>
                </div>
            </header>

            <section className="mb-8">
                <input
                    type="text"
                    placeholder="Nach Material suchen..."
                    className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </section>

            <section className="mb-8">
                <table className="table-auto w-full bg-white shadow-lg rounded-lg">
                    <thead>
                    <tr className="border-b bg-gray-200 text-gray-800">
                        <th className="p-4 text-left font-semibold">Material</th>
                        <th className="p-4 text-left font-semibold">Kategorie</th>
                        <th className="p-4 text-left font-semibold">Material-Kategorie</th>
                        <th className="p-4 text-left font-semibold">Lager</th>
                        <th className="p-4 text-left font-semibold">Menge</th>
                        <th className="p-4 text-left font-semibold">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredInventory.length > 0 ? (
                        filteredInventory.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => setSelectedMaterial(item)}
                            >
                                <td className="p-4">{item.Material}</td>
                                <td className="p-4">{item.Kategorie}</td>
                                <td className="p-4">{item.MaterialKategorie}</td>
                                <td className="p-4">{item.Lager}</td>
                                <td className="p-4">{item.Menge}</td>
                                <td className="p-4">
                                        <span
                                            className={`px-2 py-1 rounded text-white ${
                                                item.Status === "true" ? "bg-green-500" : "bg-red-500"
                                            }`}
                                        >
                                            {item.Status === "true" ? "Aktiv" : "Inaktiv"}
                                        </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-4 text-center text-gray-600" colSpan="6">
                                Kein Material gefunden.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>

            {selectedMaterial && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-8 relative w-3/4 max-w-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                            Details zu {selectedMaterial.Material}
                        </h2>
                        <table className="table-auto w-full">
                            <tbody>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Material</td>
                                <td className="p-4">{selectedMaterial.Material}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Kategorie</td>
                                <td className="p-4">{selectedMaterial.Kategorie}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Material-Kategorie</td>
                                <td className="p-4">{selectedMaterial.MaterialKategorie}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Lager</td>
                                <td className="p-4">{selectedMaterial.Lager}</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold">Menge</td>
                                <td className="p-4 flex items-center gap-4">
                                    {editingField === "quantity" ? (
                                        <div>
                                            <input
                                                type="number"
                                                className="border rounded-lg px-2 py-1 w-20 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                value={formData.quantity}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        quantity: e.target.value,
                                                    })
                                                }
                                            />
                                            {formData.quantity < selectedMaterial.Menge && (
                                                <textarea
                                                    className="mt-2 w-full border rounded-lg px-2 py-1 shadow focus:outline-none"
                                                    placeholder="Kommentar erforderlich..."
                                                    value={formData.comment}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            comment: e.target.value,
                                                        })
                                                    }
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <span>{selectedMaterial.Menge}</span>
                                    )}
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => handleEdit("quantity")}
                                    >
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        {editingField && (
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow"
                                    onClick={closeModal}
                                >
                                    Abbrechen
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow"
                                    onClick={handleSave}
                                >
                                    Speichern
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
