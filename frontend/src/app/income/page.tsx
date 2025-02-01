"use client";
import { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation"; // Importiere useRouter

// Dummy-API-Funktionen
const fetchOpenOrders = async () => {
    return [
        { orderId: 1, items: [{ MatID: 1, Material: "Material A", Menge: 10 }] },
        { orderId: 2, items: [{ MatID: 2, Material: "Material B", Menge: 5 }] },
    ];
};

const updateInventory = async (orderId) => {
    console.log("Lagerbestand aktualisiert für Bestellung:", orderId);
    return { success: true };
};

const submitComment = async (orderId, comment) => {
    console.log("Kommentar abgeschickt:", { orderId, comment });
    return { success: true };
};

const updateOrderStatus = async (orderId, status) => {
    console.log("Bestellungsstatus aktualisiert:", { orderId, status });
    return { success: true };
};

const WorkflowPage = () => {
    const [step, setStep] = useState(1); // Workflow-Schritte
    const [openOrders, setOpenOrders] = useState([]); // Offene Bestellungen
    const [selectedOrder, setSelectedOrder] = useState(null); // Ausgewählte Bestellung
    const [comment, setComment] = useState(""); // Kommentar
    const [adjustedItems, setAdjustedItems] = useState([]); // Angepasste Artikel
    const router = useRouter(); // Router für Navigation

    useEffect(() => {
        loadOpenOrders();
    }, []);

    const loadOpenOrders = async () => {
        const orders = await fetchOpenOrders();
        setOpenOrders(orders);
    };

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
        setAdjustedItems(order.items.map((item) => ({ ...item, adjustedQuantity: item.Menge })));
        setStep(2);
    };

    const handleAdjustQuantity = (matId, newQuantity) => {
        setAdjustedItems((prevItems) =>
            prevItems.map((item) =>
                item.MatID === matId
                    ? { ...item, adjustedQuantity: Math.max(0, newQuantity) }
                    : item
            )
        );
    };

    const handleNextStep = async () => {
        if (step === 2) {
            if (
                !adjustedItems.some((item) => item.adjustedQuantity !== item.Menge) &&
                !comment
            ) {
                const response = await updateOrderStatus(selectedOrder.orderId, "closed");
                if (!response.success) {
                    alert("Fehler beim Aktualisieren der Bestellung.");
                    return;
                }
                alert("Bestellung erfolgreich abgeschlossen!");
                setStep(1);
                setSelectedOrder(null);
                await loadOpenOrders(); // Aktualisiere die offene Bestellliste
                return;
            }

            if (!comment) {
                alert("Bitte schreiben Sie einen Kommentar für die Anpassungen.");
                return;
            }

            const commentResponse = await submitComment(selectedOrder.orderId, comment);
            if (!commentResponse.success) {
                alert("Fehler beim Speichern des Kommentars.");
                return;
            }
        }

        if (step === 3) {
            const inventoryResponse = await updateInventory(selectedOrder.orderId);
            if (!inventoryResponse.success) {
                alert("Fehler beim Aktualisieren des Lagerbestands.");
                return;
            }

            const orderResponse = await updateOrderStatus(selectedOrder.orderId, "closed");
            if (!orderResponse.success) {
                alert("Fehler beim Abschließen der Bestellung.");
                return;
            }

            alert("Bestellung erfolgreich abgeschlossen und Lagerbestand aktualisiert!");
            setStep(1);
            setSelectedOrder(null);
            await loadOpenOrders(); // Aktualisiere die offene Bestellliste
        }
    };

    const handleCancel = () => {
        setStep(1);
        setSelectedOrder(null);
        setComment("");
        setAdjustedItems([]);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8 flex justify-between items-center">
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow flex items-center space-x-2"
                    onClick={() => router.push("/")}
                >
                    <IoMdArrowBack size={16} />
                    <span>Zurück</span>
                </button>
                <h1 className="text-3xl font-bold text-center flex-grow text-gray-800">
                    Wareneingang Workflow
                </h1>
            </header>

            <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-center">
                            Offene Bestellungen
                        </h2>
                        <ul className="space-y-4">
                            {openOrders.map((order) => (
                                <li
                                    key={order.orderId}
                                    className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 cursor-pointer"
                                    onClick={() => handleSelectOrder(order)}
                                >
                                    <p className="font-semibold">Bestell-ID: {order.orderId}</p>
                                    <ul className="mt-2">
                                        {order.items.map((item) => (
                                            <li key={item.MatID} className="text-sm">
                                                {item.Material} - {item.Menge} Stück
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {step === 2 && selectedOrder && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-center">
                            Bestand prüfen und anpassen
                        </h2>
                        <ul className="divide-y divide-gray-300">
                            {adjustedItems.map((item) => (
                                <li key={item.MatID} className="flex justify-between items-center py-4">
                                    <div>
                                        <p className="font-semibold">{item.Material}</p>
                                        <p className="text-sm text-gray-600">
                                            Ursprünglich: {item.Menge} Stück
                                        </p>
                                    </div>
                                    <input
                                        type="number"
                                        className="w-24 border rounded px-2 py-1"
                                        value={item.adjustedQuantity}
                                        onChange={(e) =>
                                            handleAdjustQuantity(item.MatID, parseInt(e.target.value, 10))
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                        <textarea
                            className="w-full mt-4 px-4 py-2 border rounded-lg"
                            placeholder="Kommentar für Änderungen..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className="mt-4 flex justify-between">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                onClick={handleCancel}
                            >
                                Abbrechen
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                onClick={handleNextStep}
                            >
                                Weiter
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && selectedOrder && (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Inventarkorrektur abschließen</h2>
                        <p className="mb-6 text-gray-600">
                            Bestätigung, dass alle Anpassungen vorgenommen wurden.
                        </p>
                        <div className="flex justify-between">
                            <button
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                onClick={handleCancel}
                            >
                                Abbrechen
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                onClick={handleNextStep}
                            >
                                Abschluss
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkflowPage;
