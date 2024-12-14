"use client";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

// Dummy APIs

const fetchInventory = () => {
    return [
        { material: "Material A1", warehouse: "Lager 1", quantity: 100 },
        { material: "Material A2", warehouse: "Lager 1", quantity: 50 },
        { material: "Material B1", warehouse: "Lager 2", quantity: 20 },
        { material: "Material C1", warehouse: "Lager 3", quantity: 0 },
    ];
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

// Dummy API für verfügbare Lagerorte
const fetchWarehouses = () => {
    return ["Lager 1", "Lager 2", "Lager 3", "Lager 4"];
};

// Dummy API für PUT-Anfragen
const updateWarehouse = (material, newWarehouse) => {
    console.log(`PUT Anfrage: Lagerort von ${material} geändert zu: ${newWarehouse}`);
    alert(`Lagerort erfolgreich geändert zu: ${newWarehouse}`);
};

const updateQuantity = (material, newQuantity, comment = null) => {
    console.log(`PUT Anfrage: Menge von ${material} geändert zu: ${newQuantity}. Kommentar: ${comment || "Keiner"}`);
    alert(`Menge erfolgreich geändert zu: ${newQuantity}`);
};

const InventoryPage = () => {
    const [inventory] = useState(fetchInventory());
    const [warehouses, setWarehouses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [newWarehouse, setNewWarehouse] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        // Abrufen der verfügbaren Lagerorte
        setWarehouses(fetchWarehouses());
    }, []);

    const filteredInventory = inventory.filter((item) =>
        item.material.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const materialDetails = selectedMaterial ? fetchMaterialDetails(selectedMaterial.material) : null;

    const closeModal = () => {
        setSelectedMaterial(null);
        setNewWarehouse("");
        setNewQuantity("");
        setComment("");
    };

    const handleWarehouseChange = () => {
        if (newWarehouse) {
            updateWarehouse(selectedMaterial.material, newWarehouse);
            closeModal();
        } else {
            alert("Bitte wählen Sie einen neuen Lagerort aus.");
        }
    };

    const handleQuantityChange = () => {
        if (newQuantity !== "") {
            const newQuantityNum = parseInt(newQuantity, 10);
            const oldQuantity = selectedMaterial.quantity;

            if (newQuantityNum < oldQuantity && !comment) {
                alert("Ein Kommentar ist erforderlich, wenn die Menge reduziert wird.");
                return;
            }

            updateQuantity(selectedMaterial.material, newQuantityNum, newQuantityNum < oldQuantity ? comment : null);
            closeModal();
        } else {
            alert("Bitte geben Sie eine neue Menge ein.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-center">Inventar</h1>
            </header>

            {/* Suchfeld */}
            <section className="mb-8">
                <input
                    type="text"
                    placeholder="Nach Material suchen..."
                    className="w-full px-4 py-2 border rounded shadow"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </section>

            {/* Tabelle */}
            <section className="mb-8">
                <table className="table-auto w-full bg-white shadow rounded">
                    <thead>
                    <tr className="border-b">
                        <th className="p-4 text-left">Material</th>
                        <th className="p-4 text-left">Lager</th>
                        <th className="p-4 text-left">Menge</th>
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
                                <td className="p-4">{item.warehouse}</td>
                                <td className="p-4">{item.quantity}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className="p-4 text-center" colSpan="3">
                                Kein Material gefunden.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>

            {/* Modal-Fenster für Materialdetails */}
            {selectedMaterial && materialDetails && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-8 relative w-1/2"
                        onClick={(e) => e.stopPropagation()} // Stoppt das Schließen, wenn innerhalb des Modals geklickt wird
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
                                <td className="p-4 font-semibold">Lieferant</td>
                                <td className="p-4">{materialDetails.supplier}</td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Link</td>
                                <td className="p-4">
                                    <a
                                        href={materialDetails.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline"
                                    >
                                        {materialDetails.link}
                                    </a>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-4 font-semibold">Lager</td>
                                <td className="p-4">{selectedMaterial.warehouse}</td>
                            </tr>
                            <tr>
                                <td className="p-4 font-semibold">Menge</td>
                                <td className="p-4">{selectedMaterial.quantity}</td>
                            </tr>
                            </tbody>
                        </table>

                        {/* Lagerort ändern */}
                        <div className="mt-6">
                            <label className="block mb-2 font-semibold">Neuer Lagerort:</label>
                            <select
                                className="w-full px-4 py-2 border rounded shadow"
                                value={newWarehouse}
                                onChange={(e) => setNewWarehouse(e.target.value)}
                            >
                                <option value="">Lagerort auswählen...</option>
                                {warehouses.map((warehouse, index) => (
                                    <option key={index} value={warehouse}>
                                        {warehouse}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full"
                                onClick={handleWarehouseChange}
                            >
                                Lagerort ändern
                            </button>
                        </div>

                        {/* Menge ändern */}
                        <div className="mt-6">
                            <label className="block mb-2 font-semibold">Neue Menge:</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border rounded shadow"
                                placeholder="Neue Menge eingeben..."
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(e.target.value)}
                            />
                            {newQuantity !== "" && parseInt(newQuantity, 10) < selectedMaterial.quantity && (
                                <div className="mt-4">
                                    <label className="block mb-2 font-semibold">Kommentar (erforderlich bei Reduktion):</label>
                                    <textarea
                                        className="w-full px-4 py-2 border rounded shadow"
                                        placeholder="Kommentar eingeben..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>
                            )}
                            <button
                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 w-full"
                                onClick={handleQuantityChange}
                            >
                                Menge ändern
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
