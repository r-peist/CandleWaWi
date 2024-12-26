"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatLief = void 0;
const dbclient_1 = require("../db/dbclient"); // Importiere den DB-Wrapper
const getMatLief = async (event) => {
    let connection;
    try {
        // JSON-Daten aus dem Request-Body lesen
        const lieferant = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        console.log("Empfangene Daten:", lieferant);
        // Zugriff auf das Feld LiefID
        const liefID = lieferant?.LiefID;
        if (!liefID) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "LiefID fehlt in der Anfrage!",
                }),
            };
        }
        // Verbindung zur Datenbank herstellen
        connection = await (0, dbclient_1.getConnection)();
        // SQL-Abfrage mit Joins, um MaterialName und LieferantName abzurufen
        const [rows] = await connection.query(`
      SELECT 
        ml.MatLiefID,
        ml.MatID,
        ml.LiefID,
        ml.Link,
        m.Name AS MaterialName,
        l.Name AS LieferantName
      FROM materiallieferant ml
      INNER JOIN material m ON ml.MatID = m.MatID
      INNER JOIN lieferant l ON ml.LiefID = l.LiefID
      WHERE ml.LiefID = ?
    `, [liefID]);
        console.log("Abfrageergebnisse:", rows);
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
//# sourceMappingURL=handlerGetMatLief.js.map