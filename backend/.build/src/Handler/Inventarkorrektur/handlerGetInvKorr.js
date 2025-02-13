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
exports.handlerGetInvKorr = void 0;
const dbclient_1 = require("../../db/dbclient"); // Importiere den DB-Wrapper
const node_fetch_1 = __importDefault(require("node-fetch")); // Für HTTP Aufruf
const Errors = __importStar(require("../../error/errors"));
const validate_1 = require("../../validation/validate");
const handlerGetInvKorr = async (event) => {
    let connection;
    try {
        let invKorrMatsArr = [];
        let invKorrBestArr = [];
        let material = [];
        // Verbindung zur Datenbank herstellen
        connection = await (0, dbclient_1.getConnection)();
        const [korrMatrows] = await connection.query(`
      SELECT 
          im.MatID,
          m.Name,
          im.Menge,
          (ml.Menge - im.Menge) AS neue_Menge,
          ik.Kommentar,
          ik.Datum,
          ik.Benutzer
      FROM invkorr_material im
      JOIN inventarkorrektur ik ON im.InvKorrMatID = ik.InvKorrID
      JOIN material m ON im.MatID = m.MatID
      JOIN materiallager ml ON im.MatID = ml.MatID
      WHERE ik.Typ = 'Material';
    `);
        for (const korrMats of korrMatrows) {
            const { MatID, Name, Menge, neue_Menge, Kommentar, Datum, Benutzer } = korrMats;
            invKorrMatsArr.push(korrMats);
        }
        const [korrBestrows] = await connection.query(`
      SELECT 
        b.BestellID,
        ik.Kommentar,
        ik.Datum,
        ik.Benutzer
      FROM bestellung b
      JOIN invkorr_wareneingang iw ON b.BestellID = iw.BestellID
      JOIN inventarkorrektur ik ON iw.InvKorrWEID = ik.InvKorrID
      WHERE b.status = 'pruefung' AND ik.Typ = 'Bestellung';
    `);
        for (const korrBest of korrBestrows) {
            const { BestellID, Kommentar, Datum, Benutzer } = korrBest;
            const [materialrows] = await connection.query(`
        SELECT 
          mb.MatID,
          m.Name,
          mb.Menge,
          (ml.Menge - mb.Menge) AS neue_Menge
        FROM materialbestellung mb
        JOIN material m ON mb.MatID = m.MatID
        JOIN materiallager ml ON mb.MatID = ml.MatID
        WHERE mb.BestellID = ?;
        `, [BestellID]);
            for (const mats of materialrows) {
                const { MatID, Name, Menge, neue_Menge } = mats;
                material.push(mats);
            }
            invKorrBestArr.push({
                BestellID: BestellID,
                Kommentar: Kommentar,
                Datum: Datum,
                Benutzer: Benutzer,
                Material: material
            });
        }
        const inventarkorrektur = { Inventarkorrektur: { InvKorrMats: invKorrMatsArr, InvKorrBest: invKorrBestArr } };
        const validatedData = (0, validate_1.validateData)("getInvKorrSchema", inventarkorrektur);
        // HTTP-Post-Aufruf mit node-fetch
        const response = await (0, node_fetch_1.default)("http://localhost:3001/responseSender", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validatedData),
        });
        const responseBody = await response.json();
        // Erfolgreiche Antwort mit Abfrageergebnissen
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Datenbank-Abfrage der Lieferanten erfolgreich!",
                data: validatedData,
                response: responseBody,
            }),
        };
    }
    catch (error) {
        return Errors.handleError(error, "handlerGetLieferanten");
    }
    finally {
        // Verbindung freigeben
        if (connection) {
            connection.release();
        }
        await (0, dbclient_1.closePool)();
    }
};
exports.handlerGetInvKorr = handlerGetInvKorr;
//# sourceMappingURL=handlerGetInvKorr.js.map