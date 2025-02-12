"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventorySchema = void 0;
const zod_1 = require("zod");
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
exports.inventorySchema = zod_1.z.object({
    Inventar: zod_1.z.array(schemaInventar),
});
//# sourceMappingURL=inventar.js.map