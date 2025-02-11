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
exports.validateData = exports.validate = void 0;
const Errors = __importStar(require("../error/errors"));
const Schemas = __importStar(require("./schemata/index")); // Importiert alle Schemata aus dem Unterordner "schemata"
/**
 * Allgemeine Validierungs-Middleware für einkommende Daten aus dem FE die über den Wrapper verarbeitet werden.
 *
 * @param schemaName - Der Name des Schemas, das für die Validierung verwendet werden soll.
 *                    Dieser Name muss einem der exportierten Schemata in ./schemata entsprechen.
 * @param handler - Die Hauptfunktion, die ausgeführt wird, wenn die Validierung erfolgreich ist.
 */
const validate = (schemaName, handler) => {
    // Hole das Schema aus dem Schemas-Objekt
    const schema = Schemas[schemaName];
    return async (event) => {
        try {
            // JSON-Body parsen
            const body = JSON.parse(event.body || "{}");
            // Validierung mit dem entsprechenden Schema
            const validation = schema.safeParse(body);
            if (!validation.success) {
                console.error("Validation Error Details:", validation.error.errors);
                // Hier könnte man auch einen speziellen ValidationError werfen
                throw new Error("Validation failed");
            }
            else {
                console.log("Validierung der Daten aus Frontend erfolgreich!");
            }
            // Rufe den übergebenen Handler mit den validierten Daten auf
            return handler({ ...event, validatedBody: validation.data });
        }
        catch (error) {
            return Errors.handleError(error, "validate");
        }
    };
};
exports.validate = validate;
/**
 * Validiert einzelne Daten und gibt validierte Daten wieder zurück.
 * Wirft einen Fehler, falls die Validierung fehlschlägt.
 *
 * @param schemaName - Name des Schemas, das verwendet werden soll.
 * @param data - Die zu validierenden Daten.
 * @returns Das validierte Objekt (getypt als T).
 */
const validateData = (schemaName, data) => {
    const schema = Schemas[schemaName];
    const validation = schema.safeParse(data);
    if (!validation.success) {
        console.error("Validation Error Details:", validation.error.errors);
        // Rufe dein Errorhandling auf (z.B. für Logging) und werfe anschließend einen Fehler.
        Errors.handleError(new Error("Validation failed: " + JSON.stringify(validation.error.errors)), "validateEinzelDatei");
        throw new Error("Validation failed");
    }
    else {
        console.log("Validierung der Daten aus dem Handler erfolgreich!");
        return validation.data;
    }
};
exports.validateData = validateData;
//# sourceMappingURL=validate.js.map