"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatLief = void 0;
const dbclient_1 = require("../db/dbclient"); // Importiere den DB-Wrapper
const node_fetch_1 = __importDefault(require("node-fetch")); // Für HTTP Aufruf
const getMatLief = async (event) => {
    let connection;
    // JSON-Daten aus dem Request-Body lesen
    const lieferant = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    console.log("Empfangene Daten:", lieferant);
    // Zugriff auf das Feld LiefID
    const liefID = lieferant?.LiefID; // Nur das Feld LiefID extrahieren
    try {
        // Verbindung zur Datenbank herstellen
        connection = await (0, dbclient_1.getConnection)();
        // Beispiel-Abfrage: Tabelleninformationen abrufen
        const [rows] = await connection.query("SELECT * FROM materiallieferant WHERE LiefID = " + liefID);
        const matLief = JSON.stringify(rows);
        console.log(matLief);
        // HTTP-Post-Aufruf mit node-fetch
        const response = await (0, node_fetch_1.default)("http://localhost:3001/sendMatLief", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: matLief, // JSON-Daten als Body
        });
        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }
        const responseBody = await response.json();
        // Erfolgreiche Antwort mit Abfrageergebnissen
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Datenbank-Abfrage erfolgreich!",
                data: rows,
                forwardedResponse: responseBody, // Antwort der nächsten Funktion
            }),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Datenbankfehler:", error.message);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Fehler bei der Datenbankabfrage mit Error Typpiesierung",
                    error: error.message,
                }),
            };
        }
        else {
            console.error("Unbekannter Fehler:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: "Fehler bei der Datenbankabfrage ohne Error Typpiesierung",
                    error: "Ein unbekannter Fehler ist aufgetreten.",
                }),
            };
        }
    }
    finally {
        // Verbindung freigeben
        if (connection) {
            connection.release();
        }
        await (0, dbclient_1.closePool)();
    }
};
exports.getMatLief = getMatLief;
//# sourceMappingURL=handlerGetMatLief.js.map