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
exports.handlerWareneingang = void 0;
const dbclient_1 = require("../../db/dbclient"); // Importiere den DB-Wrapper
const Errors = __importStar(require("../../error/errors"));
const validate_1 = require("../../validation/validate");
const handlerWareneingang = async (event) => {
    let connection;
    // Initialisierung des Bestellungen-Objekts
    const Bestellungen = {
        Wareneingang: {
            offen: [],
            pruefung: []
        }
    };
    try {
        connection = await (0, dbclient_1.getConnection)();
        // SQL-Abfrage für die Bestellungen mit Status 'offen' oder 'in_pruefung'
        const queryBestellungen = `
      SELECT BestellID, LiefID, LagerID, Bestelldatum, Status
      FROM bestellung
      WHERE Status = 'offen' OR Status = 'pruefung'
    `;
        const [bestellRows] = await connection.execute(queryBestellungen);
        // Iteration über die abgerufenen Bestellungen
        for (const bestellung of bestellRows) {
            let i = 1;
            const { BestellID, LiefID, LagerID, Bestelldatum, Status } = bestellung;
            // SQL-Abfrage für die Materialien der aktuellen Bestellung
            const queryMaterialien = `
        SELECT m.MatID, m.Name, mb.Menge
        FROM materialbestellung mb
        JOIN material m ON mb.MatID = m.MatID
        WHERE mb.BestellID = ?
      `;
            const [materialRows] = await connection.execute(queryMaterialien, [BestellID]);
            let materialien = {
                MatID: 0,
                Name: "",
                Menge: 0,
            };
            // Erstellung des Bestellobjekts
            const bestellObjekt = {
                BestellID: BestellID,
                LiefID: LiefID,
                LagerID: LagerID,
                Bestelldatum: Bestelldatum,
                Materialien: []
            };
            for (const material of materialRows) {
                const { MatID, Name, Menge } = material;
                materialien.MatID = MatID;
                materialien.Name = Name;
                materialien.Menge = Menge;
                bestellObjekt.Materialien.push(materialien);
                console.log("ID: ", MatID, " Name: ", Name, " Menge: ", Menge);
            }
            console.log("Material: ", JSON.stringify(bestellObjekt.Materialien[0]));
            i++;
            // Hinzufügen des Bestellobjekts zum entsprechenden Status-Array
            if (Status === 'offen') {
                Bestellungen.Wareneingang.offen.push(bestellObjekt);
            }
            else if (Status === 'pruefung') {
                Bestellungen.Wareneingang.pruefung.push(bestellObjekt);
            }
        }
        const validatedData = (0, validate_1.validateData)("wareneingangSchema", Bestellungen);
        console.log("Zu verschickende Daten aus handlerWareneingang: ", JSON.stringify(validatedData, null, 2));
        // HTTP-Post-Aufruf mit node-fetch
        const response = await fetch("http://localhost:3001/responseSender", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validatedData),
        });
        // Erfolgreiche Antwort mit den zusammengestellten Bestellungen
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Bestellungen erfolgreich abgerufen.",
                data: Bestellungen
            }),
        };
    }
    catch (error) {
        return Errors.handleError(error, "handlerWareneingang");
    }
    finally {
        // Verbindung freigeben
        if (connection) {
            connection.release();
        }
        await (0, dbclient_1.closePool)();
    }
};
exports.handlerWareneingang = handlerWareneingang;
//# sourceMappingURL=handlerWareneingang.js.map