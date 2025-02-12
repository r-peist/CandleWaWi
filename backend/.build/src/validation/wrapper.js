"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGetInvKorrWE = exports.validatedGetBuchung = exports.validatedGetMatLief = exports.validatedGetLieferantFE = void 0;
// validatedHandlers.ts
const validate_1 = require("./validate");
const handlerMatLief_1 = require("../handler/Einkauf/handlerMatLief");
const handlerBestellung_1 = require("../handler/Einkauf/handlerBestellung");
const handlerBuchung_1 = require("../handler/Wareneingang/handlerBuchung");
const handlerInvKorrWE_1 = require("../handler/Wareneingang/handlerInvKorrWE");
exports.validatedGetLieferantFE = (0, validate_1.validate)("lieferantSchema", handlerMatLief_1.handlerMatLief);
exports.validatedGetMatLief = (0, validate_1.validate)("bestellungSchema", handlerBestellung_1.handlerBestellung);
exports.validatedGetBuchung = (0, validate_1.validate)("buchungSchema", handlerBuchung_1.handlerBuchung);
exports.validateGetInvKorrWE = (0, validate_1.validate)("invkorrWESchema", handlerInvKorrWE_1.handlerInvKorrWE);
//# sourceMappingURL=wrapper.js.map