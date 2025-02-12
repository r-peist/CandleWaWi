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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerBestellung = void 0;
const dbclient_1 = require("../db/dbclient"); // Importiere den DB-Wrapper
const node_fetch_1 = __importDefault(require("node-fetch"));
const Errors = __importStar(require("../error/errors"));
const handlerBestellung = async (event) => {
    let connection;
    try {
        // Überprüfen, ob der Body korrekt ist
        const body = JSON.parse(event.body || "{}");
        const bestellung = body.bestellung;
        console.log("Empfangener Body aus getBestellung:", bestellung);
        const { LiefID, LagerID, Datum, Materialien } = bestellung;
        if (!LiefID) {
            throw new Error("LiefID fehlt oder ist undefined!");
        }
        if (!LagerID) {
            throw new Error("LagerID fehlt oder ist undefined!");
        }
        if (!Datum) {
            throw new Error("Datum fehlt oder ist undefined!");
        }
        if (!Materialien) {
            throw new Error("Materialien fehlen oder sind undefined!");
        }
        console.log("LiefID: ", LiefID, ", LagerID: ", LagerID, ", Datum: ", Datum);
        const matanzahl = 0;
        // Verbindung zur Datenbank herstellen
        connection = await (0, dbclient_1.getConnection)();
        // SQL-Abfrage mit Joins, um MaterialName und LieferantName abzurufen
        const query = `
        INSERT INTO bestellung (LiefID, LagerID, Bestelldatum)
        VALUES (?, ?, ?)
    `;
        const [result] = await connection.execute(query, [LiefID, LagerID, Datum]);
        // Die automatisch generierte ID (BestellID) abrufen
        const bestellID = result.insertId;
        console.log("Abgerufene BestellID: ", bestellID);
        // Materialien in der Tabelle `MaterialBestellung` speichern
        const materialQuery = `
        INSERT INTO MaterialBestellung (BestellID, MatID, Menge)
        VALUES (?, ?, ?)
    `;
        for (const material of Materialien) {
            const { MatID, Menge } = material;
            if (!MatID || !Menge) {
                throw new Error("MatID und Menge müssen in jedem Material angegeben werden.");
            }
            await connection.execute(materialQuery, [bestellID, MatID, Menge]);
        }
        const response = await (0, node_fetch_1.default)("http://localhost:3001/responseSender", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bestellID }), // BestellID an responseSender
        });
        const responseBody = await response.json();
        if (!response.ok) {
            console.error("Fehler aus `handlerBestellung`:", responseBody);
            throw new Error(`Backend-Fehler handlerBestellung: ${responseBody.error || response.status}`);
        }
        console.log("Daten aus `handlerBestellung`:", responseBody);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Generierte BestellID erfolgreich an responseSender geschickt",
                data: responseBody.data,
            }),
        };
    }
    catch (error) {
        return Errors.handleError(error, "handlerBestellung");
    }
};
exports.handlerBestellung = handlerBestellung;
//# sourceMappingURL=handlerBestellung.js.map