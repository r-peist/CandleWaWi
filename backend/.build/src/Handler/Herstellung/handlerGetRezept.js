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
exports.handlerGetRezept = void 0;
const dbclient_1 = require("../../db/dbclient"); // Importiere den DB-Wrapper
const node_fetch_1 = __importDefault(require("node-fetch")); // Für HTTP Aufruf
const Errors = __importStar(require("../../error/errors"));
const validate_1 = require("../../validation/validate");
const handlerGetRezept = async (event) => {
    let connection;
    try {
        let rezeptKerze = [];
        let rezeptSprayDiff = [];
        let rezeptZP = [];
        let zutaten = [];
        // Verbindung zur Datenbank herstellen
        connection = await (0, dbclient_1.getConnection)();
        const [kerzerows] = await connection.query(`
      SELECT
        rk.RezeptKerzeID,
        rk.Name,
        rk.MatID,
        m.Name as Name_Mat,
        rk.BehaelterID,
        b.Name as Behaelter_name,
        rk.DeckelID,
        de.Name as Deckel_name,
        rk.DochtID,
        do.Name as Docht_name,
        rk.WarnEttID,
        w.Name as WarnEtt_name,
        rk.ZPRezeptID,
        z.Name as ZP_name
      FROM rezeptkerze rk
      JOIN material m ON rk.MatID = m.MatID
      JOIN behaelter b ON rk.BehaelterID = b.BehaelterID
      JOIN deckel de ON rk.DeckelID = de.DeckelID
      JOIN docht do ON rk.DochtID = do.DochtID
      JOIN warnettikett w ON rk.WarnEttID = w.WarnEttID
      JOIN zwischenproduktrezept z ON rk.ZPRezeptID = z.ZPRezeptID
    `);
        for (const kerze of kerzerows) {
            const { RezeptKerzeID, Name, MatID, Name_Mat, BehaelterID, Behaelter_name, DeckelID, Deckel_name, WarnEttID, WarnEtt_name, ZPRezeptID, ZP_name } = kerze;
            rezeptKerze.push(kerze);
        }
        const [spraydiffrows] = await connection.query(`
      SELECT
        rs.RezeptSprayDifID,
        rs.Name,
        rs.BehaelterID,
        b.Name as Behaelter_name,
        rs.DeckelID,
        de.Name as Deckel_name,
        rs.WarnEttID,
        w.Name as WarnEtt_name,
        rs.ZPRezeptID1,
        z.Name as ZP_name1,
        rs.ZPRezeptID2,
        z.Name as ZP_name2
      FROM rezeptspraydif rs
      JOIN behaelter b ON rs.BehaelterID = b.BehaelterID
      JOIN deckel de ON rs.DeckelID = de.DeckelID
      JOIN warnettikett w ON rs.WarnEttID = w.WarnEttID
      JOIN zwischenproduktrezept z ON rs.ZPRezeptID1 = z.ZPRezeptID OR rs.ZPRezeptID2 = z.ZPRezeptID
    `);
        for (const spraydiff of spraydiffrows) {
            const { RezeptSprayDifID, Name, BehaelterID, Behaelter_name, DeckelID, Deckel_name, ZPRezeptID1, ZP_name1, ZPRezeptID2, ZP_name2 } = spraydiff;
            rezeptSprayDiff.push(spraydiff);
        }
        const [zprows] = await connection.query(`
      SELECT
        z.ZPRezeptID,
        z.Name,
        z.Beschreibung,
        z.Erstellungsdatum AS Releasedate,
        z.Änderungsdatum AS Changedate
      FROM zwischenproduktrezept z
    `);
        for (const zp of zprows) {
            const { ZPRezeptID, Name, Beschreibung, Releasedate, Changedate } = zp;
            const [matrows] = await connection.query(`
        SELECT
          z.MatID,
          m.Name,
          z.Menge
        FROM rezeptzutaten z
        JOIN material m ON z.MatID = m.MatID
        WHERE RezeptZutatenID = ?
      `, [ZPRezeptID]);
            for (const mat of matrows) {
                const { MatID, Name, Menge } = mat;
                zutaten.push(mat);
            }
            rezeptZP.push({
                ZPRezeptID: ZPRezeptID,
                Name: Name,
                Beschreibung: Beschreibung,
                Releasedate: Releasedate,
                Changedate: Changedate,
                Zutaten: zutaten
            });
        }
        const rezept = { Rezept: { Kerze: rezeptKerze, SprayDiff: rezeptSprayDiff, ZP: rezeptZP } };
        console.log(rezept);
        const validatedData = (0, validate_1.validateData)("rezepteSchema", rezept);
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
exports.handlerGetRezept = handlerGetRezept;
//# sourceMappingURL=handlerGetRezept.js.map