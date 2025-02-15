"use client";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

const fetchInventory = async () => {
    try {
        const response = await fetch("/api/inventory", { method: "GET" });
        if (!response.ok) {
            throw new Error("Fehler beim Abrufen des Inventars");
        }
        const inventar = await response.json();
        return inventar; // Das Array aus der API
    } catch (error) {
        console.error("Fehler beim Laden des Inventars:", error);
        return [];
    }
};

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]); // Flache Liste
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [formData, setFormData] = useState({ quantity: "", comment: "" });
    const router = useRouter();

    // Lade Inventardaten und transformiere sie in eine flache Liste
    useEffect(() => {
        const loadInventory = async () => {
            const data = await fetchInventory();
            // data ist ein Array von Gruppen, z. B.:
            // [ { MatKatID: 2, Kategorie: 'Wachs', Materialien: [ { ... }, ... ] }, ... ]
            const flatInventory = data.reduce((acc, group) => {
                if (Array.isArray(group.Materialien)) {
                    const groupItems = group.Materialien.map((item) => ({
                        ...item,
                        MaterialKategorie: group.Kategorie, // Füge die übergeordnete Kategorie hinzu
                    }));
                    return acc.concat(groupItems);
                }
                return acc;
            }, []);
            setInventory(flatInventory);
        };
        loadInventory();
    }, []);

    const filteredInventory = inventory.filter((item) =>
        item.Materialname.toLowerCase().includes(searchTerm.toLowerCase())
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
            console.log("Menge aktualisiert:", {
                Material: selectedMaterial.Materialname,
                Menge: newQuantity,
            });
            // Hier könntest du auch einen API-Aufruf zum Aktualisieren durchführen
        }
        closeModal();
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8 flex flex-col">
            <header className="mb-8 flex justify-between items-center">
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition duration-300"
                    onClick={() => router.push("/")}
                >
                    <FaArrowLeft size={18} className="text-gray-700" />
                    <span className="text-gray-700">Zurück</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Inventar</h1>
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
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-lg rounded-lg">
                        <thead>
                        <tr className="border-b bg-gray-200 text-gray-800">
                            <th className="p-4 text-left font-semibold">Material</th>
                            <th className="p-4 text-left font-semibold">Kategorie</th>
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
                                    className="border-b hover:bg-gray-100 cursor-pointer transition duration-200"
                                    onClick={() => setSelectedMaterial(item)}
                                >
                                    <td className="p-4">{item.Materialname}</td>
                                    <td className="p-4">{item.MaterialKategorie}</td>
                                    <td className="p-4">{item.Lagername}</td>
                                    <td className="p-4">{item.Menge}</td>
                                    <td className="p-4">
                      <span
                          className={`px-2 py-1 rounded text-white ${
                              item.Active === "true" ? "bg-green-500" : "bg-red-500"
                          }`}
                      >
                        {item.Active === "true" ? "Aktiv" : "Inaktiv"}
                      </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="p-4 text-center text-gray-600" colSpan="5">
                                    Kein Material gefunden.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </section>

            {selectedMaterial && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-xl shadow-xl p-8 relative w-3/4 max-w-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none text-2xl"
                            onClick={closeModal}
                        >
                            <IoMdClose />
                        </button>
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                            Details zu {selectedMaterial.Materialname}
                        </h2>
                        <table className="min-w-full">
                            <tbody>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Material</td>
                                <td className="p-4">{selectedMaterial.Materialname}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Kategorie</td>
                                <td className="p-4">{selectedMaterial.MaterialKategorie}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Lager</td>
                                <td className="p-4">{selectedMaterial.Lagername}</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold">Menge</td>
                                <td className="p-4 flex items-center gap-4">
                                    {editingField === "quantity" ? (
                                        <div className="w-full">
                                            <input
                                                type="number"
                                                className="border rounded-lg px-2 py-1 w-24 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                                value={formData.quantity}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, quantity: e.target.value })
                                                }
                                            />
                                            {parseInt(formData.quantity, 10) < selectedMaterial.Menge && (
                                                <textarea
                                                    className="mt-2 w-full border rounded-lg px-2 py-1 shadow focus:outline-none"
                                                    placeholder="Kommentar erforderlich..."
                                                    value={formData.comment}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, comment: e.target.value })
                                                    }
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <span>{selectedMaterial.Menge}</span>
                                    )}
                                    <button
                                        className="text-blue-500 hover:text-blue-700 transition duration-200"
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
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                                    onClick={closeModal}
                                >
                                    Abbrechen
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
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
