"use client";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FaEdit } from "react-icons/fa";

const fetchInventory = () => {
    return [
        { material: "Material A1", warehouse: "Lager 1", quantity: 100, active: true, kat: 4, matKat: 2 },
        { material: "Material A2", warehouse: "Lager 1", quantity: 50, active: true, kat: 4, matKat: 2 },
        { material: "Material B1", warehouse: "Lager 2", quantity: 20, active: false, kat: 4, matKat: 4 },
        { material: "Material C1", warehouse: "Lager 3", quantity: 0, active: false, kat: 4, matKat: 4 },
    ];
};

const fetchCategories = () => {
    return {
        1: "Endprodukt",
        2: "zugekauftesEndprod",
        3: "Zwischenprodukt",
        4: "Rohmaterial",
        5: "Zubehör",
        6: "Verpackungsmat",
    };
};

const fetchWarehouses = () => {
    return ["Lager 1", "Lager 2", "Lager 3", "Lager 4"];
};

const fetchMaterialCategories = () => {
    return {
        1: { name: "Endprodukt", unit: "stk" },
        2: { name: "Wachs", unit: "g" },
        3: { name: "Docht", unit: "stk" },
        4: { name: "Behältnis", unit: "stk" },
        5: { name: "Gemisch", unit: "ml" },
        6: { name: "Karton", unit: "stk" },
        7: { name: "Tüte", unit: "stk" },
        8: { name: "Öl", unit: "ml" },
        9: { name: "Etiketten", unit: "stk" },
        10: { name: "Geschenkboxen", unit: "stk" },
        11: { name: "Deckel", unit: "stk" },
        12: { name: "WarnEtikett", unit: "stk" },
        13: { name: "Sonstiges", unit: "stk" },
    };
};

const fetchMaterialDetails = (material) => {
    const materialDetails = {
        "Material A1": { supplier: "Lieferant A", link: "https://example.com/material-a1" },
        "Material A2": { supplier: "Lieferant A", link: "https://example.com/material-a2" },
        "Material B1": { supplier: "Lieferant B", link: "https://example.com/material-b1" },
        "Material C1": { supplier: "Lieferant C", link: "https://example.com/material-c1" },
    };
    return materialDetails[material] || { supplier: "Unbekannt", link: "Keine Beschreibung verfügbar" };
};


const updateWarehouse = (material, newWarehouse) => {
    console.log(`PUT Anfrage: Lagerort von ${material} geändert zu: ${newWarehouse}`);
    alert(`Lagerort erfolgreich geändert zu: ${newWarehouse}`);
};

const updateQuantity = (material, newQuantity, comment = null) => {
    console.log(`PUT Anfrage: Menge von ${material} geändert zu: ${newQuantity}. Kommentar: ${comment || "Keiner"}`);
    alert(`Menge erfolgreich geändert zu: ${newQuantity}`);
};

const updateLink = (material, newLink) => {
    console.log(`PUT Anfrage: Link von ${material} geändert zu: ${newLink}`);
    alert(`Link erfolgreich geändert zu: ${newLink}`);
};

const toggleActiveStatus = (material, isActive) => {
    console.log(`PUT Anfrage: Status von ${material} geändert zu: ${isActive ? "Aktiv" : "Inaktiv"}`);
    alert(`Status erfolgreich geändert zu: ${isActive ? "Aktiv" : "Inaktiv"}`);
};

const InventoryPage = () => {
    const [inventory, setInventory] = useState(fetchInventory());
    const [categories] = useState(fetchCategories());
    const [materialCategories] = useState(fetchMaterialCategories());
    const [warehouses, setWarehouses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [formData, setFormData] = useState({ quantity: "", warehouse: "", link: "", comment: "" });

    useEffect(() => {
        setWarehouses(fetchWarehouses());
    }, []);

    const filteredInventory = inventory.filter((item) =>
        item.material.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const materialDetails = selectedMaterial ? fetchMaterialDetails(selectedMaterial.material) : null;

    const closeModal = () => {
        setSelectedMaterial(null);
        setEditingField(null);
        setFormData({ quantity: "", warehouse: "", link: "", comment: "" });
    };

    const handleEdit = (field) => {
        setEditingField(field);
        if (field === "quantity") {
            setFormData({ ...formData, quantity: selectedMaterial.quantity });
        } else if (field === "warehouse") {
            setFormData({ ...formData, warehouse: selectedMaterial.warehouse });
        } else if (field === "link") {
            setFormData({ ...formData, link: materialDetails.link });
        }
    };

    const handleSave = () => {
        if (editingField === "quantity") {
            const newQuantity = parseInt(formData.quantity, 10);
            if (newQuantity < selectedMaterial.quantity && !formData.comment) {
                alert("Ein Kommentar ist erforderlich, wenn die Menge reduziert wird.");
                return;
            }
            updateQuantity(selectedMaterial.material, newQuantity, formData.comment);
        } else if (editingField === "warehouse") {
            updateWarehouse(selectedMaterial.material, formData.warehouse);
        } else if (editingField === "link") {
            updateLink(selectedMaterial.material, formData.link);
        }
        closeModal();
    };

    const handleToggleActive = (material) => {
        const updatedInventory = inventory.map((item) =>
            item.material === material.material
                ? { ...item, active: !item.active }
                : item
        );
        setInventory(updatedInventory);
        toggleActiveStatus(material.material, !material.active);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-center">Inventar</h1>
            </header>

            <section className="mb-8">
                <input
                    type="text"
                    placeholder="Nach Material suchen..."
                    className="w-full px-4 py-2 border rounded shadow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </section>

            <section className="mb-8">
                <table className="table-auto w-full bg-white shadow rounded">
                    <thead>
                    <tr className="border-b">
                        <th className="p-4 text-left">Material</th>
                        <th className="p-4 text-left">Kategorie</th>
                        <th className="p-4 text-left">Mat-Kategorie</th>
                        <th className="p-4 text-left">Lager</th>
                        <th className="p-4 text-left">Menge</th>
                        <th className="p-4 text-left">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredInventory.length > 0 ? (
                        filteredInventory.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b hover:bg-gray-200 cursor-pointer"
                                onClick={() => setSelectedMaterial(item)}
                            >
                                <td className="p-4">{item.material}</td>
                                <td className="p-4">{categories[item.kat]}</td>
                                <td className="p-4">{materialCategories[item.matKat].name} ({materialCategories[item.matKat].unit})</td>
                                <td className="p-4">{item.warehouse}</td>
                                <td className="p-4">{item.quantity}</td>
                                <td className="p-4">
                                    <span
                                        className={`px-2 py-1 rounded text-white ${item.active ? "bg-green-500" : "bg-red-500"}`}
                                    >
                                        {item.active ? "Aktiv" : "Inaktiv"}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-4 text-center" colSpan="6">
                                Kein Material gefunden.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>

            {selectedMaterial && materialDetails && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-8 relative w-1/2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-red-600"
                            onClick={closeModal}
                        >
                            <IoMdClose size={25} />
                        </button>
                        <h2 className="text-2xl font-semibold mb-4">Details zu {selectedMaterial.material}</h2>
                        <table className="table-auto w-full">
                            <tbody>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Material</td>
                                <td className="p-4">{selectedMaterial.material}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Kategorie</td>
                                <td className="p-4">{categories[selectedMaterial.kat]}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Material-Kategorie</td>
                                <td className="p-4">{materialCategories[selectedMaterial.matKat].name} ({materialCategories[selectedMaterial.matKat].unit})</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Lieferant</td>
                                <td className="p-4">{materialDetails.supplier}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Link</td>
                                <td className="p-4 flex items-center gap-2">
                                    {editingField === "link" ? (
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded shadow"
                                            value={formData.link}
                                            onChange={(e) =>
                                                setFormData({ ...formData, link: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <a
                                            href={materialDetails.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                        >
                                            {materialDetails.link}
                                        </a>
                                    )}
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => handleEdit("link")}
                                    >
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Lager</td>
                                <td className="p-4 flex items-center gap-2">
                                    {editingField === "warehouse" ? (
                                        <select
                                            className="w-full px-4 py-2 border rounded shadow"
                                            value={formData.warehouse}
                                            onChange={(e) =>
                                                setFormData({ ...formData, warehouse: e.target.value })
                                            }
                                        >
                                            <option value="">Lagerort auswählen...</option>
                                            {warehouses.map((warehouse, index) => (
                                                <option key={index} value={warehouse}>
                                                    {warehouse}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>{selectedMaterial.warehouse}</span>
                                    )}
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => handleEdit("warehouse")}
                                    >
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold">Menge</td>
                                <td className="p-4 flex items-center gap-2">
                                    {editingField === "quantity" ? (
                                        <div className="w-full">
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2 border rounded shadow"
                                                value={formData.quantity}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, quantity: e.target.value })
                                                }
                                            />
                                            {formData.quantity < selectedMaterial.quantity && (
                                                <div className="mt-2">
                                                        <textarea
                                                            className="w-full px-4 py-2 border rounded shadow"
                                                            placeholder="Kommentar erforderlich..."
                                                            value={formData.comment}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, comment: e.target.value })
                                                            }
                                                        />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span>{selectedMaterial.quantity}</span>
                                    )}
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => handleEdit("quantity")}
                                    >
                                        <FaEdit />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold">Status</td>
                                <td className="p-4 flex items-center gap-2">
                                    <span
                                        className={`px-2 py-1 rounded text-white ${selectedMaterial.active ? "bg-green-500" : "bg-red-500"}`}
                                    >
                                        {selectedMaterial.active ? "Aktiv" : "Inaktiv"}
                                    </span>
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => handleToggleActive(selectedMaterial)}
                                    >
                                        {selectedMaterial.active ? "Deaktivieren" : "Aktivieren"}
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        {editingField && (
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                    onClick={closeModal}
                                >
                                    Abbrechen
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
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
