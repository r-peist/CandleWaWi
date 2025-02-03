"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaSave, FaEdit, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Dummy-Daten für Lagerorte
const dummyWarehouses = [
    { LagerID: 1, Name: "Burgstraße" },
    { LagerID: 2, Name: "Keller" },
    { LagerID: 3, Name: "Messe" },
];

// Dummy-Inventar-Daten (hier entspricht "id" auch der MatID, und es wurde ein SKU-Feld ergänzt)
const dummyInventory = [
    {
        id: 1,
        Material: "Wachs_Soja_40.000g",
        SKU: "WAX-001-NAT",
        Kategorie: "Rohmaterial",
        MaterialKategorie: "Wachs",
        Lager: "Burgstraße",
        LagerID: 1,
        Menge: 10,
        Status: "true",
    },
    {
        id: 2,
        Material: "Glas_Braun_180ml",
        SKU: "CON-001-GLASS-BROWN",
        Kategorie: "Verpackungsmat",
        MaterialKategorie: "Behältnis",
        Lager: "Keller",
        LagerID: 2,
        Menge: 20,
        Status: "true",
    },
];

// Dummy globale Lieferanten (entspricht Tabelle lieferant)
const dummySuppliers = [
    { LiefID: 1, Name: "Amazon" },
    { LiefID: 2, Name: "Destrebution" },
    { LiefID: 3, Name: "ExternerLadeneinkauf" },
];

// Dummy-Daten für die m-m Zuordnung (entspricht Tabelle materiallieferant)
const dummyMaterialSuppliers = [
    { MatLiefID: 1, MatID: 1, LiefID: 1, Link: "https://www.amazon.de/" },
    { MatLiefID: 2, MatID: 2, LiefID: 1, Link: "https://www.amazon.de/" },
];

const InventoryPage = () => {
    const router = useRouter();
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    // Erweiterter State inkl. SKU
    const [editData, setEditData] = useState({
        Menge: "",
        LagerID: "",
        Status: "true",
        SKU: "",
    });
    // State für die m-m Zuordnungen (materiallieferant)
    const [materialSuppliers, setMaterialSuppliers] = useState([]);
    // State für das Bearbeiten/Hinzufügen einer Lieferantenassociation
    const [supplierEditData, setSupplierEditData] = useState({
        editing: false,
        MatLiefID: null,
        LiefID: "",
        Link: "",
    });

    useEffect(() => {
        setInventory(dummyInventory);
        setMaterialSuppliers(dummyMaterialSuppliers);
    }, []);

    const filteredInventory = inventory.filter((item) =>
        item.Material.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (item) => {
        setSelectedItem(item);
        setEditData({
            Menge: item.Menge,
            LagerID: item.LagerID,
            Status: item.Status,
            SKU: item.SKU || "",
        });
        // Zurücksetzen der Lieferantenassociation-Bearbeitung
        setSupplierEditData({
            editing: false,
            MatLiefID: null,
            LiefID: "",
            Link: "",
        });
    };

    const closeModal = () => {
        setSelectedItem(null);
        setSupplierEditData({
            editing: false,
            MatLiefID: null,
            LiefID: "",
            Link: "",
        });
    };

    const handleSave = () => {
        // Aktualisiere das Inventar (Dummy-Update)
        setInventory((prev) =>
            prev.map((item) =>
                item.id === selectedItem.id
                    ? {
                        ...item,
                        Menge: editData.Menge,
                        LagerID: editData.LagerID,
                        Lager:
                            dummyWarehouses.find(
                                (wh) => wh.LagerID === parseInt(editData.LagerID)
                            )?.Name || item.Lager,
                        Status: editData.Status,
                        SKU: editData.SKU,
                    }
                    : item
            )
        );
        closeModal();
    };

    // Filtern der Lieferantenassociationen für das aktuell bearbeitete Material
    const currentMaterialSuppliers = selectedItem
        ? materialSuppliers.filter((ms) => ms.MatID === selectedItem.id)
        : [];

    // Handler für Änderungen in der Lieferantenassociation-Form
    const handleSupplierEditChange = (e) => {
        const { name, value } = e.target;
        setSupplierEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStartNewSupplierAssociation = () => {
        setSupplierEditData({ editing: true, MatLiefID: null, LiefID: "", Link: "" });
    };

    const handleEditSupplierAssociation = (association) => {
        setSupplierEditData({
            editing: true,
            MatLiefID: association.MatLiefID,
            LiefID: association.LiefID.toString(), // als String für den Dropdown-Wert
            Link: association.Link,
        });
    };

    const handleDeleteSupplierAssociation = (MatLiefID) => {
        setMaterialSuppliers((prev) =>
            prev.filter((ms) => ms.MatLiefID !== MatLiefID)
        );
    };

    const handleSupplierAssociationSave = () => {
        if (supplierEditData.MatLiefID) {
            // Bestehende Association bearbeiten
            setMaterialSuppliers((prev) =>
                prev.map((ms) =>
                    ms.MatLiefID === supplierEditData.MatLiefID
                        ? {
                            ...ms,
                            LiefID: parseInt(supplierEditData.LiefID),
                            Link: supplierEditData.Link,
                        }
                        : ms
                )
            );
        } else {
            // Neue Association hinzufügen
            const newId = materialSuppliers.length
                ? Math.max(...materialSuppliers.map((ms) => ms.MatLiefID)) + 1
                : 1;
            const newAssociation = {
                MatLiefID: newId,
                MatID: selectedItem.id,
                LiefID: parseInt(supplierEditData.LiefID),
                Link: supplierEditData.Link,
            };
            setMaterialSuppliers((prev) => [...prev, newAssociation]);
        }
        // Formular zurücksetzen
        setSupplierEditData({ editing: false, MatLiefID: null, LiefID: "", Link: "" });
    };

    const handleCancelSupplierEdit = () => {
        setSupplierEditData({ editing: false, MatLiefID: null, LiefID: "", Link: "" });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Header mit Zurück-Button */}
            <header className="mb-8 flex justify-between items-center">
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow flex items-center gap-2"
                    onClick={() => router.push("/")}
                >
                    <FaArrowLeft />
                    Zurück
                </button>
                <h1 className="text-3xl font-bold">Inventar Übersicht</h1>
            </header>

            {/* Suchfeld */}
            <section className="mb-8">
                <input
                    type="text"
                    placeholder="Nach Material suchen..."
                    className="w-full px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </section>

            {/* Inventar-Tabelle */}
            <section className="mb-8">
                <table className="table-auto w-full bg-white shadow-lg rounded-lg">
                    <thead>
                    <tr className="border-b bg-gray-200 text-gray-800">
                        <th className="p-4 text-left font-semibold">Material</th>
                        <th className="p-4 text-left font-semibold">SKU</th>
                        <th className="p-4 text-left font-semibold">Kategorie</th>
                        <th className="p-4 text-left font-semibold">Material-Kategorie</th>
                        <th className="p-4 text-left font-semibold">Lager</th>
                        <th className="p-4 text-left font-semibold">Menge</th>
                        <th className="p-4 text-left font-semibold">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredInventory.length > 0 ? (
                        filteredInventory.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b hover:bg-gray-100 cursor-pointer"
                                onClick={() => openModal(item)}
                            >
                                <td className="p-4">{item.Material}</td>
                                <td className="p-4">{item.SKU}</td>
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
                            <td className="p-4 text-center text-gray-600" colSpan="7">
                                Kein Material gefunden.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>

            {/* Modal zum Bearbeiten eines Materials inklusive Lieferantenverwaltung und SKU */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg p-8 relative w-3/4 max-w-2xl overflow-y-auto max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                            {selectedItem.Material} bearbeiten
                        </h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">SKU</label>
                            <input
                                type="text"
                                value={editData.SKU}
                                onChange={(e) =>
                                    setEditData({ ...editData, SKU: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Menge</label>
                            <input
                                type="number"
                                value={editData.Menge}
                                onChange={(e) =>
                                    setEditData({ ...editData, Menge: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Lagerort</label>
                            <select
                                value={editData.LagerID}
                                onChange={(e) =>
                                    setEditData({ ...editData, LagerID: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">-- Auswahl --</option>
                                {dummyWarehouses.map((wh) => (
                                    <option key={wh.LagerID} value={wh.LagerID}>
                                        {wh.Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Status</label>
                            <select
                                value={editData.Status}
                                onChange={(e) =>
                                    setEditData({ ...editData, Status: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="true">Aktiv</option>
                                <option value="false">Inaktiv</option>
                            </select>
                        </div>

                        {/* Abschnitt für Lieferanten & Links */}
                        <div className="mt-8">
                            <h3 className="text-2xl font-semibold mb-4">
                                Lieferanten &amp; Links
                            </h3>
                            {currentMaterialSuppliers.length > 0 ? (
                                <table className="table-auto w-full bg-gray-50 rounded-lg mb-4">
                                    <thead>
                                    <tr className="border-b bg-gray-200 text-gray-800">
                                        <th className="p-2 text-left font-semibold">Lieferant</th>
                                        <th className="p-2 text-left font-semibold">Link</th>
                                        <th className="p-2 text-left font-semibold">Aktion</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {currentMaterialSuppliers.map((assoc) => {
                                        const supplier = dummySuppliers.find(
                                            (s) => s.LiefID === assoc.LiefID
                                        );
                                        return (
                                            <tr key={assoc.MatLiefID} className="border-b">
                                                <td className="p-2">
                                                    {supplier ? supplier.Name : "Unbekannt"}
                                                </td>
                                                <td className="p-2">
                                                    <a
                                                        href={assoc.Link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 underline"
                                                    >
                                                        {assoc.Link}
                                                    </a>
                                                </td>
                                                <td className="p-2 flex gap-2">
                                                    <button
                                                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1"
                                                        onClick={() =>
                                                            handleEditSupplierAssociation(assoc)
                                                        }
                                                    >
                                                        <FaEdit />
                                                        Bearbeiten
                                                    </button>
                                                    <button
                                                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1"
                                                        onClick={() =>
                                                            handleDeleteSupplierAssociation(assoc.MatLiefID)
                                                        }
                                                    >
                                                        <FaTrash />
                                                        Löschen
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-gray-600 mb-4">
                                    Keine Lieferanten zugeordnet.
                                </p>
                            )}

                            {supplierEditData.editing ? (
                                <div className="p-4 border rounded-lg bg-gray-100">
                                    <h4 className="text-xl font-semibold mb-4">
                                        {supplierEditData.MatLiefID
                                            ? "Lieferantenassociation bearbeiten"
                                            : "Neue Lieferantenassociation hinzufügen"}
                                    </h4>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Lieferant</label>
                                        <select
                                            name="LiefID"
                                            value={supplierEditData.LiefID}
                                            onChange={handleSupplierEditChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">-- Auswahl --</option>
                                            {dummySuppliers.map((s) => (
                                                <option key={s.LiefID} value={s.LiefID}>
                                                    {s.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Link</label>
                                        <input
                                            type="url"
                                            name="Link"
                                            value={supplierEditData.Link}
                                            onChange={handleSupplierEditChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow"
                                            onClick={handleCancelSupplierEdit}
                                        >
                                            Abbrechen
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow flex items-center gap-2"
                                            onClick={handleSupplierAssociationSave}
                                        >
                                            <FaSave />
                                            Speichern
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow"
                                    onClick={handleStartNewSupplierAssociation}
                                >
                                    Neuen Lieferanten hinzufügen
                                </button>
                            )}
                        </div>

                        {/* Speichern und Abbrechen */}
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow"
                                onClick={closeModal}
                            >
                                Abbrechen
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow flex items-center gap-2"
                                onClick={handleSave}
                            >
                                <FaSave />
                                Speichern
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;
