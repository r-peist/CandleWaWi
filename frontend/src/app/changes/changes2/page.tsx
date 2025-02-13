"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Material {
    MatID: number;
    Name: string;
    Menge: number;       // Alte Menge
    neue_Menge: number;
}

interface Order {
    BestellID: number;
    Kommentar: string;
    Datum: string;
    Benutzer: string;
    Material: Material[];
}

const OrdersPage = () => {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetch("/api/inventarkorrektur")
            .then((res) => res.json())
            .then((data) => {
                // Es wird erwartet, dass die Antwort folgendes Format hat:
                // { Inventarkorrektur: { InvKorrMats: [...], InvKorrBest: [ ... ] } }
                if (data?.Inventarkorrektur?.InvKorrBest) {
                    setOrders(data.Inventarkorrektur.InvKorrBest);
                }
            })
            .catch((error) =>
                console.error("Fehler beim Abrufen der Inventarkorrektur:", error)
            );
    }, []);

    const handleAccept = (orderId: number) => {
        console.log("Bestellung angenommen:", orderId);
        // Hier könnte ein API-Call erfolgen, um die Annahme zu bestätigen
        setOrders((prev) => prev.filter((order) => order.BestellID !== orderId));
    };

    const handleReject = (orderId: number) => {
        console.log("Bestellung abgelehnt:", orderId);
        // Hier könnte ein API-Call erfolgen, um die Ablehnung zu melden
        setOrders((prev) => prev.filter((order) => order.BestellID !== orderId));
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-8">
            {/* Header mit Zurück-Button */}
            <header className="mb-10 flex justify-between items-center">
                <button
                    onClick={() => router.push("/changes")}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition duration-300"
                >
                    <FaArrowLeft className="text-gray-700" />
                    <span className="text-gray-700">Zurück</span>
                </button>
                <h1 className="text-4xl font-bold text-gray-800">
                    Bestellungen mit Bestandsänderung
                </h1>
            </header>

            <div className="space-y-8">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div
                            key={order.BestellID}
                            className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition duration-300"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-4">
                                <div className="mb-4 md:mb-0">
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        Bestell-ID: {order.BestellID}
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        <span className="font-medium">Datum:</span>{" "}
                                        {new Date(order.Datum).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Benutzer:</span> {order.Benutzer}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Kommentar:</span> {order.Kommentar}
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => handleAccept(order.BestellID)}
                                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300"
                                    >
                                        <FaCheck />
                                        <span>Annehmen</span>
                                    </button>
                                    <button
                                        onClick={() => handleReject(order.BestellID)}
                                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
                                    >
                                        <FaTimes />
                                        <span>Ablehnen</span>
                                    </button>
                                </div>
                            </div>
                            {order.Material && order.Material.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border">
                                        <thead>
                                        <tr className="bg-gray-200">
                                            <th className="p-3 text-left">MatID</th>
                                            <th className="p-3 text-left">Name</th>
                                            <th className="p-3 text-left">Alte Menge</th>
                                            <th className="p-3 text-left">Neue Menge</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {order.Material.map((mat) => (
                                            <tr
                                                key={mat.MatID}
                                                className="border-t hover:bg-gray-50 transition duration-300"
                                            >
                                                <td className="p-3">{mat.MatID}</td>
                                                <td className="p-3">{mat.Name}</td>
                                                <td className="p-3">{mat.Menge}</td>
                                                <td className="p-3">{mat.neue_Menge}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">Keine Bestellungen gefunden.</p>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
