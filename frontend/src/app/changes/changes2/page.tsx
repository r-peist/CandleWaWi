"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Dummy-Daten für Bestellungen
const dummyOrders = [
    {
        bestellid: 1,
        alteMenge: 50,
        neueMenge: 45,
        kommentar: "Reduzierung wegen Beschädigung",
    },
    {
        bestellid: 2,
        alteMenge: 30,
        neueMenge: 35,
        kommentar: "Zugabe fehlerhaft geliefert",
    },
    {
        bestellid: 3,
        alteMenge: 100,
        neueMenge: 95,
        kommentar: "Schadensfall",
    },
];

const OrdersPage = () => {
    const router = useRouter();
    const [orders, setOrders] = useState([]);

    // Dummy-Daten laden
    useEffect(() => {
        setOrders(dummyOrders);
    }, []);

    const handleAccept = (orderId) => {
        console.log("Bestellung angenommen:", orderId);
        // Dummy-Update: Entferne die Bestellung aus der Liste
        setOrders((prev) =>
            prev.filter((order) => order.bestellid !== orderId)
        );
    };

    const handleReject = (orderId) => {
        console.log("Bestellung abgelehnt:", orderId);
        // Dummy-Update: Entferne die Bestellung aus der Liste
        setOrders((prev) =>
            prev.filter((order) => order.bestellid !== orderId)
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Header mit Zurück-Button */}
            <header className="mb-8 flex justify-between items-center">
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 shadow flex items-center gap-2"
                    onClick={() => router.push("/changes")}
                >
                    <FaArrowLeft />
                    Zurück
                </button>
                <h1 className="text-3xl font-bold">
                    Bestellungen mit Bestandsänderung
                </h1>
            </header>

            {/* Bestellungs-Tabelle */}
            <section className="mb-8">
                <table className="table-auto w-full bg-white shadow-lg rounded-lg">
                    <thead>
                    <tr className="border-b bg-gray-200 text-gray-800">
                        <th className="p-4 text-left font-semibold">Bestell-ID</th>
                        <th className="p-4 text-left font-semibold">Alte Menge</th>
                        <th className="p-4 text-left font-semibold">Neue Menge</th>
                        <th className="p-4 text-left font-semibold">Kommentar</th>
                        <th className="p-4 text-left font-semibold">Aktion</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <tr
                                key={order.bestellid}
                                className="border-b hover:bg-gray-100"
                            >
                                <td className="p-4">{order.bestellid}</td>
                                <td className="p-4">{order.alteMenge}</td>
                                <td className="p-4">{order.neueMenge}</td>
                                <td className="p-4">{order.kommentar}</td>
                                <td className="p-4 flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow flex items-center gap-1"
                                        onClick={() => handleAccept(order.bestellid)}
                                    >
                                        <FaCheck />
                                        Annehmen
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow flex items-center gap-1"
                                        onClick={() => handleReject(order.bestellid)}
                                    >
                                        <FaTimes />
                                        Ablehnen
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                className="p-4 text-center text-gray-600"
                                colSpan="5"
                            >
                                Keine Bestellungen gefunden.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default OrdersPage;
