"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatedGetMatLief = exports.validatedGetLieferantFE = void 0;
// validatedHandlers.ts
const validate_1 = require("./validate");
const handlerGetMatLief_1 = require("../handler/Einkauf/handlerGetMatLief");
const handlerBestellung_1 = require("../handler/Einkauf/handlerBestellung");
exports.validatedGetLieferantFE = (0, validate_1.validate)("lieferantSchema", handlerGetMatLief_1.getMatLief);
exports.validatedGetMatLief = (0, validate_1.validate)("bestellungSchema", handlerBestellung_1.handlerBestellung);
// Beispiel für einen weiteren Endpunkt, der Daten enthält (z. B. Inventardaten)
// Angenommen, dein Schema heißt "inventorySchema" und dein Handler heißt inventoryHandler
//export const validatedInventoryHandler = validate("inventorySchema", inventoryHandler);
// Weitere validierte Handler können hier analog definiert werden.
//# sourceMappingURL=wrapper.js.map