"use client";
import { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation"; // Importiere useRouter
// import { fetchOpenOrders, updateInventory, submitComment, updateOrderStatus } from "../api"; // Importiere API-Funktionen

// Dummy-API-Funktionen (hier mit Status-Feld)
const fetchOpenOrders = async () => {
    try {
        // Session über API abrufen
        const response = await fetch("/api/auth/session");
        if (!response.ok) throw new Error("Session konnte nicht geladen werden.");

        const sessionData = await response.json();
        if (!sessionData.user) {
            throw new Error("Kein Benutzer angemeldet.");
        }

        console.log("Aktueller Benutzer:", sessionData.user.email);

        return [
            {
                orderId: 1,
                status: "in_pruefung",
                items: [{ MatID: 1, Material: "Material A", Menge: 10 }],
            },
            {
                orderId: 2,
                status: "open",
                items: [{ MatID: 2, Material: "Material B", Menge: 5 }],
            },
            {
                orderId: 3,
                status: "open",
                items: [{ MatID: 3, Material: "Material C", Menge: 8 }],
            },
        ];
    } catch (error) {
        console.error("Fehler beim Abrufen der Session:", error);
        return [];
    }
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
    const [step, setStep] = useState(1); // 1: Übersicht, 2: Korrektur
    const [openOrders, setOpenOrders] = useState([]); // Alle Bestellungen
    const [selectedOrder, setSelectedOrder] = useState(null); // Bestellung, die korrigiert werden soll
    const [comment, setComment] = useState(""); // Kommentar für Korrektur
    const [adjustedItems, setAdjustedItems] = useState([]); // Angepasste Artikel (neue Mengen)
    const router = useRouter();

    useEffect(() => {
        loadOpenOrders();
    }, []);

    const loadOpenOrders = async () => {
        const orders = await fetchOpenOrders();
        setOpenOrders(orders);
    };

    // Unterteile die Bestellungen in zwei Gruppen:
    const infoOrders = openOrders.filter(
        (order) => order.status === "in_pruefung"
    );
    const actionableOrders = openOrders.filter(
        (order) => order.status !== "in_pruefung"
    );

    // Aktion: Bestellung buchen
    const handleBookOrder = async (order) => {
        if (window.confirm("Bist du dir sicher, dass du die Bestellung buchen willst?")) {
            const response = await updateOrderStatus(order.orderId, "closed");
            if (response.success) {
                alert(`Bestellung ${order.orderId} wurde gebucht!`);
                await loadOpenOrders();
            } else {
                alert("Fehler beim Buchen der Bestellung.");
            }
        }
    };

    // Aktion: Fehlerhaft – Bestellung als fehlerhaft markieren und Korrektur starten
    const handleMarkFaulty = async (order) => {
        if (window.confirm("Bist du dir sicher, dass du die Bestellung als fehlerhaft markieren willst?")) {
            const response = await updateOrderStatus(order.orderId, "in_pruefung");
            if (response.success) {
                setSelectedOrder(order);
                setAdjustedItems(
                    order.items.map((item) => ({
                        ...item,
                        adjustedQuantity: item.Menge,
                    }))
                );
                setStep(2);
            } else {
                alert("Fehler beim Markieren der Bestellung als fehlerhaft.");
            }
        }
    };

    // In Schritt 2: Menge anpassen
    const handleAdjustQuantity = (matId, newQuantity) => {
        setAdjustedItems((prevItems) =>
            prevItems.map((item) =>
                item.MatID === matId
                    ? { ...item, adjustedQuantity: Math.max(0, newQuantity) }
                    : item
            )
        );
    };

    // In Schritt 2: Korrektur abschließen
    const handleNextStep = async () => {
        if (!comment) {
            alert("Bitte geben Sie einen Kommentar zur Korrektur ein.");
            return;
        }
        const commentResponse = await submitComment(selectedOrder.orderId, comment);
        if (!commentResponse.success) {
            alert("Fehler beim Speichern des Kommentars.");
            return;
        }
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
        setComment("");
        setAdjustedItems([]);
        await loadOpenOrders();
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
                    Wareneingang
                </h1>
            </header>

            <div className="max-w-3xl mx-auto space-y-8">
                {/* Bereich: Inventarkorrektur (nur Info) */}
                {infoOrders.length > 0 && (
                    <div className="bg-gray-200 p-4 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-center">
                            Inventarkorrektur (nur Info)
                        </h2>
                        <ul className="space-y-4">
                            {infoOrders.map((order) => (
                                <li
                                    key={order.orderId}
                                    className="p-4 bg-gray-100 rounded-lg shadow-md"
                                >
                                    <p className="font-semibold">
                                        Bestell-ID: {order.orderId} (Status: {order.status})
                                    </p>
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

                {/* Bereich: Offene Bestellungen */}
                {actionableOrders.length > 0 && (
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-2xl font-semibold mb-4 text-center">
                            Offene Bestellungen
                        </h2>
                        <ul className="space-y-4">
                            {actionableOrders.map((order) => (
                                <li
                                    key={order.orderId}
                                    className="p-4 bg-gray-50 rounded-lg shadow-md flex flex-col gap-2"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            Bestell-ID: {order.orderId} (Status: {order.status})
                                        </p>
                                        <ul className="mt-1 text-sm text-gray-700">
                                            {order.items.map((item) => (
                                                <li key={item.MatID}>
                                                    {item.Material} - {item.Menge} Stück
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            onClick={() => handleBookOrder(order)}
                                        >
                                            Bestellung buchen
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => handleMarkFaulty(order)}
                                        >
                                            Fehlerhaft
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Schritt 2: Inventarkorrektur */}
                {step === 2 && selectedOrder && (
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-4 text-center">
                            Inventarkorrektur für Bestellung {selectedOrder.orderId}
                        </h2>
                        <ul className="divide-y divide-gray-300">
                            {adjustedItems.map((item) => (
                                <li
                                    key={item.MatID}
                                    className="flex justify-between items-center py-4"
                                >
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
                                            handleAdjustQuantity(
                                                item.MatID,
                                                parseInt(e.target.value, 10)
                                            )
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                        <textarea
                            className="w-full mt-4 px-4 py-2 border rounded-lg"
                            placeholder="Kommentar für Korrektur..."
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
