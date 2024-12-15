"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatLief = void 0;
const dbclient_1 = require("../db/dbclient"); // Importiere den DB-Wrapper
const axios_1 = __importDefault(require("axios")); //Für HTTP Aufruf
const getMatLief = async (event) => {
    let connection;
    // JSON-Daten aus dem Request-Body lesen
    const { lieferant } = JSON.parse(event.body || "{}");
    // Zugriff auf das Feld LiefID
    const parsedData = JSON.parse(lieferant); // Den String "getMatLief" in ein Objekt umwandeln
    const liefID = parsedData.LiefID; // Nur das Feld LiefID extrahieren
    console.log("Extrahierte LiefID:", liefID);
    try {
        // Verbindung zur Datenbank herstellen
        connection = await (0, dbclient_1.getConnection)();
        // Beispiel-Abfrage: Tabelleninformationen abrufen
        const [rows] = await connection.query("SELECT * FROM materiallieferant WHERE LiefID = " + liefID);
        const matLief = JSON.stringify(rows);
        const response = await axios_1.default.post("http://localhost:3000/sendMatLief", 
        // der Funktion sendLieferanten werden Daten übergeben
        { sendLieferanten: matLief });
        // Erfolgreiche Antwort mit Abfrageergebnissen
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Datenbank-Abfrage erfolgreich!",
                data: rows,
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
