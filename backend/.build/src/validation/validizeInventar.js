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
exports.validateInventar = void 0;
const zod_1 = require("zod");
const Errors = __importStar(require("../error/errors"));
// Funktion zum Validieren der DB-Daten
const validateInventar = (data) => {
    try {
        console.log("Daten in validizer: ", data);
        const validation = inventorySchema.safeParse(data);
        if (!validation.success) {
            console.error("Validierungsfehler:", validation.error.errors);
            throw new Error("Ungültige Daten aus der Validierung in validizeInventar");
        }
        console.log("Erhaltene validierte Daten: ", validation.data);
        return data;
    }
    catch (error) {
        return Errors.handleError(error, "validizeInventar");
    }
};
exports.validateInventar = validateInventar;
// Definition des Schemas für ein einzelnes Inventarobjekt
const schemaInventar = zod_1.z.object({
    Material: zod_1.z.string(),
    Kategorie: zod_1.z.string(),
    MaterialKategorie: zod_1.z.string(),
    Lager: zod_1.z.string(),
    Menge: zod_1.z.number().nonnegative(),
    Status: zod_1.z.string(),
});
// Definition des Schemas für das gesamte Inventar
const inventorySchema = zod_1.z.object({
    Inventar: zod_1.z.array(schemaInventar),
});
//# sourceMappingURL=validizeInventar.js.map