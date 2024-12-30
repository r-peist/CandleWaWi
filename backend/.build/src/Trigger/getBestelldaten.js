"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestelldaten = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const getBestelldaten = async (event) => {
    try {
        // Überprüfen, ob der Body korrekt ist
        const body = JSON.parse(event.body || "{}");
        console.log("Empfangener Body aus dem Frontend:", body);
        const liefID = body.LiefID; // Extrahiere LiefID
        if (!liefID) {
            throw new Error("LiefID fehlt oder ist undefined!");
        }
        const lagerID = body.LagerID; // Extrahiere LiefID
        if (!lagerID) {
            throw new Error("LiefID fehlt oder ist undefined!");
        }
        const date = body.Datum; // Extrahiere LiefID
        if (!date) {
            throw new Error("LiefID fehlt oder ist undefined!");
        }
        const matanzahl = 0;
        for (let i = 0, i; , i++;) {
        }
        const response = await (0, node_fetch_1.default)("http://localhost:3001/getMatLief", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ LiefID }), // LiefID an Backend senden
        });
        const responseBody = await response.json();
        if (!response.ok) {
            console.error("Fehler aus `getMatLief`:", responseBody);
            throw new Error(`Backend-Fehler: ${responseBody.error || response.status}`);
        }
        console.log("Daten aus `getMatLief`:", responseBody);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Erfolgreich verarbeitet!",
                data: responseBody.data,
            }),
        };
    }
    catch (error) {
        console.error("Fehler in `getLieferantFE`:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Fehler beim Verarbeiten der Anfrage!",
                error: error instanceof Error ? error.message : "Unbekannter Fehler",
            }),
        };
    }
};
exports.getBestelldaten = getBestelldaten;
//# sourceMappingURL=getBestelldaten.js.map