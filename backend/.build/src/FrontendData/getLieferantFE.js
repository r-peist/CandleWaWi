"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLieferantFE = void 0;
const axios_1 = __importDefault(require("axios")); //Für HTTP Aufruf
const getLieferantFE = async (event) => {
    try {
        // Daten aus dem Request-Body extrahieren
        const receivedLief = JSON.parse(event.body || "{}");
        // Simulierte Speicherung der Daten (z. B. in einer Datenbank oder einem Cache)
        console.log("Empfangene Daten:", receivedLief);
        const response = await axios_1.default.post("http://localhost:3001/getMatLief", // URL der zweiten Funktion
        receivedLief // JSON-Daten als Body
        );
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Daten erfolgreich empfangen und zwischengespeichert (MatLief)",
            }),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Datenbankfehler:", error.message);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Fehler bei der Datenbankabfrage (MatLief) mit Error Typpiesierung",
                    error: error.message,
                }),
            };
        }
        else {
            console.error("Unbekannter Fehler:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Fehler bei der Datenbankabfrage (MatLief) ohne Error Typpiesierung",
                    error: "Ein unbekannter Fehler ist aufgetreten.",
                }),
            };
        }
    }
};
exports.getLieferantFE = getLieferantFE;
