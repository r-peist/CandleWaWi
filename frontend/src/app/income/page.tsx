"use client";
import { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function Income() {
    const [openOrders, setOpenOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [comment, setComment] = useState("");
    const [showBookModal, setShowBookModal] = useState(false);
    const [orderForBooking, setOrderForBooking] = useState(null);
    const [showFaultyModal, setShowFaultyModal] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Funktion zum Laden der offenen Bestellungen
    const loadOpenOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/income", {
                cache: "no-store",
                next: { revalidate: 0, dynamic: "force-dynamic" },
            });

            if (!res.ok) {
                throw new Error(`Fehler: ${res.status}`);
            }

            const result = await res.json();

            if (!result.offen || !result.pruefung) {
                throw new Error("Leere oder ungültige Antwort vom Backend!");
            }

            // Falls das Backend keine Daten liefert, soll es stoppen:
            if (result.offen.length === 0 && result.pruefung.length === 0) {
                throw new Error("Keine offenen Bestellungen gefunden!");
            }

            setOpenOrders([
                ...result.offen.map((order) => ({
                    orderId: order.BestellID,
                    status: "open",
                    items: order.Materialien.map((mat) => ({
                        MatID: mat.MatID,
                        Material: mat.Name,
                        Menge: mat.Menge,
                    })),
                })),
                ...result.pruefung.map((order) => ({
                    orderId: order.BestellID,
                    status: "in_pruefung",
                    items: order.Materialien.map((mat) => ({
                        MatID: mat.MatID,
                        Material: mat.Name,
                        Menge: mat.Menge,
                    })),
                })),
            ]);
        } catch (err: any) {
            console.error("Fehler beim Laden der Bestellungen:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOpenOrders();
    }, []);

    // Damit auch bei "Back"-Navigation immer neu geladen wird:
    useEffect(() => {
        const handlePageShow = (event: any) => {
            if (event.persisted) {
                loadOpenOrders();
            }
        };

        window.addEventListener("pageshow", handlePageShow);
        return () => {
            window.removeEventListener("pageshow", handlePageShow);
        };
    }, []);

    // Aufteilung in bearbeitbare Bestellungen und solche in Prüfung
    const actionableOrders = openOrders.filter(
        (order) => order.status !== "in_pruefung"
    );
    const infoOrders = openOrders.filter(
        (order) => order.status === "in_pruefung"
    );

    // Buchung initiieren
    const handleBookOrder = (order) => {
        setOrderForBooking(order);
        setShowBookModal(true);
    };

    const confirmBookOrder = async () => {
        if (orderForBooking) {
            try {
                const response = await fetch("/api/bookorder", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId: orderForBooking.orderId }),
                });
                const result = await response.json();

                if (result.Status?.success) {
                    alert(`Bestellung ${orderForBooking.orderId} wurde gebucht!`);
                    setShowBookModal(false);
                    setOrderForBooking(null);
                    await loadOpenOrders();
                } else {
                    alert("Fehler beim Buchen der Bestellung.");
                }
            } catch (error) {
                console.error("Fehler beim Buchen:", error);
                alert("Fehler beim Buchen der Bestellung.");
            }
        }
    };

    // Fehlerhaft-Meldung initiieren
    const handleMarkFaulty = (order) => {
        setSelectedOrder(order);
        setShowFaultyModal(true);
    };

    const confirmFaultyOrder = async () => {
        if (!comment) {
            alert("Bitte geben Sie einen Kommentar zur Fehlerhaft-Meldung ein.");
            return;
        }
        try {
            const response = await fetch("/api/faultyorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: selectedOrder.orderId,
                    comment: comment,
                }),
            });
            const result = await response.json();

            if (result.Status?.success) {
                alert("Bestellung wurde als fehlerhaft markiert und in Prüfung gesetzt.");
                setShowFaultyModal(false);
                setSelectedOrder(null);
                setComment("");
                await loadOpenOrders();
            } else {
                alert("Fehler beim Senden der Fehlermeldung.");
            }
        } catch (error) {
            console.error("Fehler beim Senden der Fehlermeldung:", error);
            alert("Fehler beim Senden der Fehlermeldung.");
        }
    };

    const cancelFaultyOrder = () => {
        setShowFaultyModal(false);
        setSelectedOrder(null);
        setComment("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8">
            <header className="mb-10 flex justify-between items-center">
                <button
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition duration-300"
                    onClick={() => router.push("/")}
                >
                    <IoMdArrowBack size={20} className="text-gray-700" />
                    <span className="text-gray-700">Zurück</span>
                </button>
                <h1 className="text-4xl font-bold text-gray-800 text-center flex-grow">
                    Wareneingang
                </h1>
            </header>

            <div className="max-w-3xl mx-auto space-y-8">
                {error && <div className="text-red-600 text-center">{error}</div>}
                {loading && <div className="text-center text-gray-600">Lade Daten…</div>}

                {/* Offene Bestellungen */}
                {actionableOrders.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-6 text-center">
                            Offene Bestellungen
                        </h2>
                        <ul className="space-y-6">
                            {actionableOrders.map((order) => (
                                <li
                                    key={order.orderId}
                                    className="p-6 bg-gray-50 rounded-xl shadow hover:shadow-xl transition duration-300 flex flex-col gap-4"
                                >
                                    <div>
                                        <p className="font-semibold text-lg">
                                            Bestell-ID: {order.orderId}
                                        </p>
                                        <ul className="mt-2 text-sm text-gray-700">
                                            {order.items.map((item) => (
                                                <li key={item.MatID}>
                                                    {item.Material} – {item.Menge} Stück
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <button
                                            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-300"
                                            onClick={() => handleBookOrder(order)}
                                        >
                                            Bestellung buchen
                                        </button>
                                        <button
                                            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-300"
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

                {/* Bestellungen in Prüfung (Info – ausgegraut) */}
                {infoOrders.length > 0 && (
                    <div className="bg-gray-200 p-6 rounded-xl">
                        <h2 className="text-2xl font-semibold mb-6 text-center">
                            Bestellungen in Prüfung
                        </h2>
                        <ul className="space-y-6">
                            {infoOrders.map((order) => (
                                <li
                                    key={order.orderId}
                                    className="p-6 bg-gray-100 rounded-xl shadow-md opacity-60"
                                >
                                    <p className="font-semibold text-lg">
                                        Bestell-ID: {order.orderId}
                                    </p>
                                    <ul className="mt-3 text-sm text-gray-700">
                                        {order.items.map((item) => (
                                            <li key={item.MatID}>
                                                {item.Material} – {item.Menge} Stück
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
                            className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-semibold mb-4 text-center">
                                Bestätigung
                            </h2>
                            <p className="mb-6 text-center">
                                Bist du sicher, dass du die Bestellung{" "}
                                {orderForBooking.orderId} buchen möchtest?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition duration-300"
                                    onClick={() => setShowBookModal(false)}
                                >
                                    Abbrechen
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition duration-300"
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
                            className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-semibold mb-4 text-center">
                                Fehlermeldung senden
                            </h2>
                            <p className="mb-6 text-center">
                                Bitte geben Sie einen Kommentar ein, um die Bestellung{" "}
                                {selectedOrder.orderId} als fehlerhaft zu melden.
                            </p>
                            <textarea
                                className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Kommentar..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition duration-300"
                                    onClick={cancelFaultyOrder}
                                >
                                    Abbrechen
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition duration-300"
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
}
