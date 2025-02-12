"use client";
import { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

// Dummy-API-Funktionen (Status-Feld)
const fetchOpenOrders = async () => {
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

const income = () => {
    const [openOrders, setOpenOrders] = useState([]); // Alle Bestellungen
    const [selectedOrder, setSelectedOrder] = useState(null); // Für fehlerhafte Meldung bzw. Modal
    const [comment, setComment] = useState(""); // Kommentar für Fehlerhaft-Meldung
    const [showBookModal, setShowBookModal] = useState(false); // Steuert das Buchungs-Bestätigungsmodal
    const [orderForBooking, setOrderForBooking] = useState(null);
    const [showFaultyModal, setShowFaultyModal] = useState(false); // Steuert das Fehlerhaft-Modal (Popup)
    const router = useRouter();

    useEffect(() => {
        loadOpenOrders();
    }, []);

    const loadOpenOrders = async () => {
        const orders = await fetchOpenOrders();
        setOpenOrders(orders);
    };

    // Unterteile Bestellungen in zwei Gruppen:
    // Offene Bestellungen (bearbeitbar)
    const actionableOrders = openOrders.filter(
        (order) => order.status !== "in_pruefung"
    );
    // Bestellungen, die in Prüfung sind (nur Info – ausgegraut)
    const infoOrders = openOrders.filter(
        (order) => order.status === "in_pruefung"
    );

    // Modal: Buchung bestätigen (wie gehabt)
    const handleBookOrder = (order) => {
        setOrderForBooking(order);
        setShowBookModal(true);
    };

    const confirmBookOrder = async () => {
        if (orderForBooking) {
            const response = await updateOrderStatus(orderForBooking.orderId, "closed");
            if (response.success) {
                alert(`Bestellung ${orderForBooking.orderId} wurde gebucht!`);
                setShowBookModal(false);
                setOrderForBooking(null);
                await loadOpenOrders();
            } else {
                alert("Fehler beim Buchen der Bestellung.");
            }
        }
    };

    // Fehlerhaft: Statt eines Bestätigungsdialogs öffnet sich ein Modal mit Kommentar-Eingabe.
    const handleMarkFaulty = (order) => {
        setSelectedOrder(order);
        setShowFaultyModal(true);
    };

    const confirmFaultyOrder = async () => {
        if (!comment) {
            alert("Bitte geben Sie einen Kommentar zur Fehlerhaft-Meldung ein.");
            return;
        }
        const commentResponse = await submitComment(selectedOrder.orderId, comment);
        if (!commentResponse.success) {
            alert("Fehler beim Speichern des Kommentars.");
            return;
        }
        // Setze den Status der Bestellung auf "in_pruefung"
        const statusResponse = await updateOrderStatus(selectedOrder.orderId, "in_pruefung");
        if (!statusResponse.success) {
            alert("Fehler beim Aktualisieren des Bestellungsstatus.");
            return;
        }
        alert("Bestellung wurde als fehlerhaft markiert und in Prüfung gesetzt.");
        setShowFaultyModal(false);
        setSelectedOrder(null);
        setComment("");
        await loadOpenOrders();
    };

    const cancelFaultyOrder = () => {
        setShowFaultyModal(false);
        setSelectedOrder(null);
        setComment("");
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
                                            Bestell-ID: {order.orderId}
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

                {/* Bereich: Bestellungen in Prüfung (nur Info, ausgegraut) */}
                {infoOrders.length > 0 && (
                    <div className="bg-gray-200 p-4 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-center">
                            Bestellungen in Prüfung
                        </h2>
                        <ul className="space-y-4">
                            {infoOrders.map((order) => (
                                <li
                                    key={order.orderId}
                                    className="p-4 bg-gray-100 rounded-lg shadow-md opacity-50"
                                >
                                    <p className="font-semibold">
                                        Bestell-ID: {order.orderId}
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

                {/* Modal für Buchungsbestätigung */}
                {showBookModal && orderForBooking && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowBookModal(false)}
                    >
                        <div
                            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-semibold mb-4 text-center">
                                Bestätigung
                            </h2>
                            <p className="mb-4 text-center">
                                Bist du dir sicher, dass du die Bestellung {orderForBooking.orderId} buchen möchtest?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                    onClick={() => setShowBookModal(false)}
                                >
                                    Abbrechen
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    onClick={confirmBookOrder}
                                >
                                    Buchen
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal für Fehlerhaft-Meldung */}
                {showFaultyModal && selectedOrder && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={cancelFaultyOrder}
                    >
                        <div
                            className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-semibold mb-4 text-center">
                                Fehlermeldung senden
                            </h2>
                            <p className="mb-4 text-center">
                                Bitte geben Sie einen Kommentar ein, um die Bestellung {selectedOrder.orderId} als fehlerhaft zu melden.
                            </p>
                            <textarea
                                className="w-full mb-4 px-4 py-2 border rounded-lg"
                                placeholder="Kommentar..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                    onClick={cancelFaultyOrder}
                                >
                                    Abbrechen
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    onClick={confirmFaultyOrder}
                                >
                                    Fehlermeldung senden
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default income;
