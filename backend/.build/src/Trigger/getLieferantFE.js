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
exports.getLieferantFE = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const Errors = __importStar(require("../error/errors"));
const getLieferantFE = async (event) => {
    try {
        // Überprüfen, ob der Body korrekt ist
        const body = JSON.parse(event.body || "{}");
        console.log("Empfangener Body aus dem Frontend:", body);
        const LiefID = body.LiefID; // Extrahiere LiefID
        if (!LiefID) {
            throw new Error("LiefID fehlt oder ist undefined!");
        }
        console.log("Extrahierte LiefID:", LiefID);
        const response = await (0, node_fetch_1.default)("http://localhost:3001/getMatLief", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ LiefID }), // LiefID an Backend senden
        });
        const responseBody = await response.json();
        if (!response.ok) {
            console.error("Fehler aus `getMatLief`:", responseBody);
            throw new Error(`Backend-Fehler: ${responseBody.error || response.status}`);
        }
        console.log("Daten aus `getMatLief`:", responseBody);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Erfolgreich verarbeitet!",
                data: responseBody.data,
            }),
        };
    }
    catch (error) {
        return Errors.handleError(error, "getLieferantFE");
    }
};
exports.getLieferantFE = getLieferantFE;
//# sourceMappingURL=getLieferantFE.js.map