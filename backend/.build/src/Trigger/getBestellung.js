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
const node_fetch_1 = __importDefault(require("node-fetch"));
const Errors = __importStar(require("../error/errors"));
const logger_1 = __importDefault(require("../utils/logger"));
const processBestellung = async (event) => {
    try {
        // Überprüfen, ob der Body korrekt ist
        const bestellung = event.validatedBody;
        logger_1.default.info("Empfangener Body aus dem Frontend für Bestellung:", bestellung);
        // HTTP-Post-Aufruf mit node-fetch
        const response = await (0, node_fetch_1.default)("http://localhost:3001/handlerBestellung", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bestellung }),
        });
        let responseBody;
        try {
            responseBody = await response.json();
        }
        catch (parseError) {
            throw new Errors.InternalServerError("Ungültige Antwort von Folgefunktion handlerBestellung", {
                rawResponse: await response.text(),
            });
        }
        if (!response.ok) {
            logger_1.default.info("Fehler aus Backend-Handler:", responseBody);
            // Spezifische Fehler basierend auf dem Statuscode
            switch (response.status) {
                case 502:
                    throw new Errors.BadGatewayError(`Bad Gateway: Fehler im Backend-Handler`, responseBody);
                case 503:
                    throw new Errors.ServiceUnavailableError(`Service Unavailable: Backend-Dienst nicht verfügbar`, responseBody);
                default:
                    throw new Errors.InternalServerError(`Backend-Fehler: ${responseBody.error || response.status}`, responseBody);
            }
        }
        logger_1.default.info("Erfolgreiche Antwort aus Backend:", responseBody);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Bestelldaten erfolgreich vom FE erhalten und verarbeitet!",
                data: responseBody.data,
            }),
        };
    }
    catch (error) {
        return Errors.handleError(error, "getBestellung");
    }
};
//# sourceMappingURL=getBestellung.js.map