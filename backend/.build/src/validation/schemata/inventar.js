"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventarSchema = void 0;
const zod_1 = require("zod");
const materialSchema = zod_1.z.object({
    MatID: zod_1.z.number(),
    Materialname: zod_1.z.string().min(1, { message: "Materialname ist erforderlich" }),
    // SKU darf null sein, daher verwenden wir nullable() – alternativ auch optional()
    SKU: zod_1.z.string().nullable(),
    Active: zod_1.z.string().min(1, { message: "Active ist erforderlich" }),
});
const inventarItemSchema = zod_1.z.object({
    MatKatID: zod_1.z.number()
        .min(1, { message: "MatKatID muss mindestens 1 sein" })
        .max(13, { message: "MatKatID darf maximal 13 sein" }),
    Kategorie: zod_1.z.string().min(1, { message: "Kategorie ist erforderlich" }),
    Materialien: zod_1.z.array(materialSchema),
});
exports.inventarSchema = zod_1.z.object({
    Inventar: zod_1.z.array(inventarItemSchema),
});
//# sourceMappingURL=inventar.js.map