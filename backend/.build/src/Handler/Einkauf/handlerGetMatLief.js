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
exports.getMatLief = void 0;
const dbclient_1 = require("../../db/dbclient"); // Importiere den DB-Wrapper
const Errors = __importStar(require("../../error/errors"));
const validate_1 = require("../../validation/validate");
const getMatLief = async (event) => {
    let connection;
    try {
        // JSON-Daten aus dem Request-Body lesen
        const { Lieferant: { LiefID } } = event.validatedBody;
        const liefID = LiefID;
        console.log("Empfangene LiefID:", liefID);
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
        const MatLiefs = { MatLiefs: rows };
        //Validierung des JSONs
        const validatedData = (0, validate_1.validateData)("matLiefSchema", MatLiefs);
        //console.log("Validierte Daten in handler: ", validatedData);
        // HTTP-Post-Aufruf mit node-fetch
        const response = await fetch("http://localhost:3001/responseSender", {
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
                message: "Datenbank-Abfrage erfolgreich!",
                data: validatedData,
                response: responseBody,
            }),
        };
    }
    catch (error) {
        return Errors.handleError(error, "handlerGetMatLief");
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