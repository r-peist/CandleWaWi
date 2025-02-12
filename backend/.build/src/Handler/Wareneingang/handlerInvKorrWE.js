"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerInvKorrWE = void 0;
const dbclient_1 = require("../../db/dbclient"); // Importiere den DB-Wrapper
const Errors = __importStar(require("../../error/errors"));
const handlerInvKorrWE = async (event) => {
    let connection;
    try {
        // JSON-Daten aus dem Request-Body lesen
        const { InvKorrWE: { Kommentar, Datum, Benutzer, BestellID } } = event.validatedBody;
        console.log("Daten aus FE: ", Kommentar, Datum, Benutzer, BestellID);
        // Verbindung zur Datenbank herstellen
        connection = await (0, dbclient_1.getConnection)();
        // Transaktion starten
        await connection.beginTransaction();
        // Bestellung auf pruefung setzen
        await connection.query(`UPDATE bestellung
        SET status = 'pruefung'
        WHERE BestellID = ?;`, [BestellID]);
        // Hier fangen wir das Ergebnis der INSERT-Abfrage ab, um die generierte InvKorrID zu erhalten
        const [result] = await connection.query(`INSERT INTO inventarkorrektur (Kommentar, Datum, Benutzer, Status, Typ)
         VALUES (?, ?, ?, 'offen', 'bestellung');`, [Kommentar, Datum, Benutzer]);
        const invKorrID = result.insertId;
        // Neue Materialien ins Lager einfügen, falls sie noch nicht existieren
        await connection.query(`INSERT INTO invkorr_wareneingang (InvKorrWEID, BestellID)
        VALUES (?, ?);
        `, [invKorrID, BestellID]);
        // Transaktion committen
        await connection.commit();
        // Erfolgreiche Antwort zurückgeben
        const responseDB = { Status: { success: true, message: "Bestellung erfolgreich abgeschlossen und Lager aktualisiert", data: invKorrID } };
        // HTTP-Post-Aufruf mit node-fetch
        const response = await fetch("http://localhost:3001/responseSender", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(responseDB),
        });
        const responseBody = await response.json();
        // Erfolgreiche Antwort mit Abfrageergebnissen
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Datenbank-Abfrage erfolgreich!",
                data: responseDB,
                response: responseBody,
            }),
        };
    }
    catch (error) {
        return Errors.handleError(error, "handlerBuchung");
    }
    finally {
        // Verbindung freigeben
        if (connection) {
            connection.release();
        }
        await (0, dbclient_1.closePool)();
    }
};
exports.handlerInvKorrWE = handlerInvKorrWE;
//# sourceMappingURL=handlerInvKorrWE.js.map