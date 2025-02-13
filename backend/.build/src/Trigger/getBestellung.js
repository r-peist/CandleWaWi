"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestellung = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const getBestellung = async (event) => {
    try {
        // Überprüfen, ob der Body korrekt ist
        const bestellung = JSON.parse(event.body || "{}");
        console.log("Empfangener Body aus dem Frontend für Bestellung:", bestellung);
        // HTTP-Post-Aufruf mit node-fetch
        const response = await (0, node_fetch_1.default)("http://localhost:3001/handlerBestellung", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bestellung }),
        });
        const responseBody = await response.json();
        if (!response.ok) {
            console.error("Fehler aus `getBestellung`:", responseBody);
            throw new Error(`Backend-Fehler: ${responseBody.error || response.status}`);
        }
        console.log("Daten aus `getMatLief`:", responseBody);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Bestelldaten erfolgreich vom FE erhalten und verarbeitet!",
                data: responseBody.data,
            }),
        };
    }
    catch (error) {
        console.error("Fehler in `getBestellung`:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Fehler beim Verarbeiten der Anfrage!",
                error: error instanceof Error ? error.message : "Unbekannter Fehler",
            }),
        };
    }
};
exports.getBestellung = getBestellung;
//# sourceMappingURL=getBestellung.js.map