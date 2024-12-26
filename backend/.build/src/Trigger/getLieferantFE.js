"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLieferantFE = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const getLieferantFE = async (event) => {
    try {
        // Überprüfen, ob der Body korrekt ist
        const body = JSON.parse(event.body || "{}");
        console.log("Empfangener Body aus dem Frontend:", body);
        const LiefID = body.LiefID; // Extrahiere LiefID
        if (!LiefID) {
            throw new Error("LiefID fehlt oder ist undefined!");
        }
        console.log("Extrahierte LiefID:", LiefID);
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
exports.getLieferantFE = getLieferantFE;
//# sourceMappingURL=getLieferantFE.js.map