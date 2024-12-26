"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLieferantFE = void 0;
const node_fetch_1 = __importDefault(require("node-fetch")); // Für HTTP Aufruf
const getLieferantFE = async (event) => {
    try {
        // Daten aus dem Request-Body extrahieren
        const { receivedLief } = JSON.parse(event.body || "{}");
        //const receivedLief = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        console.log("Empfangene LieferantenIDs aus dem Frontend: ", receivedLief);
        // HTTP-Post-Aufruf mit node-fetch
        const response = await (0, node_fetch_1.default)("http://localhost:3001/getMatLief", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(receivedLief), // JSON-Daten als Body
        });
        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }
        const responseBody = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Daten erfolgreich empfangen und zwischengespeichert (MatLief)",
                forwardedResponse: responseBody, // Antwort von getMatLief
            }),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Fehler beim Verarbeiten der Anfrage:", error.message);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Fehler beim Verarbeiten der Anfrage (MatLief) mit Error Typpiesierung",
                    error: error.message,
                }),
            };
        }
        else {
            console.error("Unbekannter Fehler:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Fehler beim Verarbeiten der Anfrage (MatLief) ohne Error Typpiesierung",
                    error: "Ein unbekannter Fehler ist aufgetreten.",
                }),
            };
        }
    }
};
exports.getLieferantFE = getLieferantFE;
//# sourceMappingURL=getLieferantFE.js.map