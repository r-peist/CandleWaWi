"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerInventar = void 0;
const dbclient_1 = require("../db/dbclient"); // Importiere den DB-Wrapper
const node_fetch_1 = __importDefault(require("node-fetch")); // Für HTTP Aufruf
const handlerInventar = async (event) => {
    let connection;
    const inventar = [];
    try {
        // Verbindung zur Datenbank herstellen
        connection = await (0, dbclient_1.getConnection)();
        // SQL-Abfrage, um MatID, LagerID und Menge aus der Tabelle `materiallager` zu lesen
        const query = `
        SELECT MatID, LagerID, Menge
        FROM materiallager
    `;
        const [rows] = await connection.execute(query);
        // Zwischenspeichern der Daten
        const materialLager = rows.map((row) => ({
            MatID: row.MatID,
            LagerID: row.LagerID,
            Menge: row.Menge,
        }));
        console.log("Materialdaten aus `materiallager`:", materialLager);
        for (let i = 0; i < materialLager.length; i++) {
            const { MatID, LagerID, Menge } = materialLager[i];
            // Abfrage für material Tabelle
            const queryMat = `
            SELECT KatID, MatKatID, Active, Name
            FROM material
            WHERE MatID=?
        `;
            const [matrows] = await connection.execute(queryMat, [MatID]);
            // Zwischenspeichern der Daten
            const material = matrows.map((row) => ({
                KatID: row.KatID,
                MatKatID: row.MatKatID,
                Active: row.Active,
                Name: row.Name
            }));
            const materialname = material[0].Name;
            const active = material[0].Active;
            let status;
            if (active) {
                status = "Aktiv";
            }
            else {
                status = "Inaktiv";
            }
            //Abfrage für Kategorie
            const queryKat = `
            SELECT Name
            FROM kategorie
            WHERE KatID=?
        `;
            const [katrows] = await connection.execute(queryKat, [material[0].KatID]);
            const kategorie = katrows.map((row) => ({
                Name: row.Name
            }));
            const kategoriename = kategorie[0].Name;
            //Abfrage für Material Kategorie
            const queryMatKat = `
            SELECT Name
            FROM materialkategorie
            WHERE MatKatID=?
        `;
            const [matkatrows] = await connection.execute(queryMatKat, [material[0].MatKatID]);
            const materialkategorie = matkatrows.map((row) => ({
                Name: row.Name
            }));
            const materialkategoriename = materialkategorie[0].Name;
            //Abfrage Lagername
            const queryLager = `
            SELECT Name
            FROM lager
            WHERE LagerID=?
        `;
            const [lagerrows] = await connection.execute(queryLager, [materialLager[i].LagerID]);
            const lager = lagerrows.map((row) => ({
                Name: row.Name
            }));
            const lagername = lager[0].Name;
            inventar.push({
                Material: materialname,
                Kategorie: kategoriename,
                MaterialKategorie: materialkategoriename,
                Lager: lagername,
                Menge: materialLager[i].Menge,
                Status: active
            });
        }
        console.log(inventar);
        // HTTP-Post-Aufruf mit node-fetch
        const response = await (0, node_fetch_1.default)("http://localhost:3001/sendInventar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inventar: inventar }),
        });
        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }
        const responseBody = await response.json();
        // Erfolgreiche Antwort mit Abfrageergebnissen
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Datenbank-Abfrage der Lieferanten erfolgreich!",
                data: rows,
                response: responseBody,
            }),
        };
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Datenbankfehler Lieferanten:", error.message);
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
exports.handlerInventar = handlerInventar;
//# sourceMappingURL=handlerInventar.js.map