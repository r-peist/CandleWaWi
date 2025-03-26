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
exports.handlerHerstellung = void 0;
const dbclient_1 = require("../../db/dbclient"); // Importiere den DB-Wrapper
const node_fetch_1 = __importDefault(require("node-fetch")); // Für HTTP Aufruf
const Errors = __importStar(require("../../error/errors"));
const handlerHerstellung = async (event) => {
    let connection;
    const { Rezept: { Name, RezeptID, BehaelterID, DeckelID, MatID, Menge, Materialien = [] } } = event.validatedBody;
    let mats = [];
    try {
        connection = await (0, dbclient_1.getConnection)();
        await connection.beginTransaction();
        if (Name === "Kerze") {
            const [matrows] = await connection.query(`
        SELECT
          b.MatID AS BehaelterMatID,
          d.MatID AS DeckelMatID
        FROM material m
        JOIN behaelter b ON m.MatID = b.MatID
        JOIN deckel d ON m.MatID = d.MatID
        WHERE b.MatID = ? OR d.MatID = ?
      `, [BehaelterID, DeckelID]);
            const { BehaelterMatID, DeckelMatID } = matrows[0];
            mats.push({ MatID: MatID, Menge: Menge }, { MatID: BehaelterMatID, Menge: Menge }, { MatID: DeckelMatID, Menge: Menge }, ...Materialien);
            for (const rows of mats) {
                const ;
            }
            const [update] = await connection.query(`
        UPDATE materiallager
        SET Menge = Menge - COALESCE (?, bestand)
        WHERE MatID = ?
      `);
        }
        else if (Name === "SprayDiff") {
            const [rows] = await connection.query(`
      
      `);
        }
        else if (Name === "ZP") {
            const [rows] = await connection.query(`
      
      `);
        }
        const validatedData = "";
        //validateData("updatedSchema", updated);
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
        // Rollback der Transaktion bei Fehler
        if (connection) {
            await connection.rollback();
            //Innerer try() um weiter oben rollback abzufangen und dann das responseObjekt mit Fehlermeldung auszustatten.
        }
        return Errors.handleError(error, "handlerUpsertRezept");
    }
    finally {
        // Verbindung freigeben
        if (connection) {
            connection.release();
        }
        await (0, dbclient_1.closePool)();
    }
};
exports.handlerHerstellung = handlerHerstellung;
//# sourceMappingURL=handlerHerstellung.js.map