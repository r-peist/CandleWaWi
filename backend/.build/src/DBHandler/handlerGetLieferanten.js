"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLieferanten = void 0;
const dbclient_1 = require("../db/dbclient"); // Importiere den DB-Wrapper
const sendLieferanten_1 = require("../SendFrontend/sendLieferanten");
const getLieferanten = async (event) => {
    let connection;
    try {
        // Verbindung zur Datenbank herstellen
        connection = await (0, dbclient_1.getConnection)();
        // Beispiel-Abfrage: Tabelleninformationen abrufen
        const [rows] = await connection.query("SELECT * FROM lieferant");
        const dataLieferant = JSON.stringify(rows);
        (0, sendLieferanten_1.sendLieferanten)(dataLieferant);
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
exports.getLieferanten = getLieferanten;
