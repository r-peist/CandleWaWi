"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventarSchema = void 0;
const zod_1 = require("zod");
const MaterialSchema = zod_1.z.object({
    MatID: zod_1.z.number(),
    Materialname: zod_1.z.string().min(1, { message: "Materialname ist erforderlich" }),
    SKU: zod_1.z.string().nullable(),
    Active: zod_1.z.string().min(1, { message: "Active ist erforderlich" }),
    LagerID: zod_1.z.number().positive({ message: "LagerID muss eine positive Zahl sein" }),
    Lagername: zod_1.z.string().min(1, { message: "Lagername ist erforderlich" }),
    Menge: zod_1.z.number().nonnegative({ message: "Menge muss 0 oder größer sein" }),
    DochtID: zod_1.z.number().nullable().refine((val) => val !== null, {
        message: "DochtID ist erforderlich, wenn MatKatID 3 ist.",
        path: ["DochtID"]
    }).optional(),
    Dochtname: zod_1.z.string().nullable().refine((val) => val !== null, {
        message: "Dochtname ist erforderlich, wenn MatKatID 3 ist.",
        path: ["Dochtname"]
    }).optional(),
    BehaelterID: zod_1.z.number().nullable().refine((val) => val !== null, {
        message: "BehaelterID ist erforderlich, wenn MatKatID 4 ist.",
        path: ["BehaelterID"]
    }).optional(),
    Behaeltername: zod_1.z.string().nullable().refine((val) => val !== null, {
        message: "Behaeltername ist erforderlich, wenn MatKatID 4 ist.",
        path: ["Behaeltername"]
    }).optional(),
    DeckelID: zod_1.z.number().nullable().refine((val) => val !== null, {
        message: "DeckelID ist erforderlich, wenn MatKatID 11 ist.",
        path: ["DeckelID"]
    }).optional(),
    Deckelname: zod_1.z.string().nullable().refine((val) => val !== null, {
        message: "Deckelname ist erforderlich, wenn MatKatID 11 ist.",
        path: ["Deckelname"]
    }).optional(),
    WarnEttID: zod_1.z.number().nullable().refine((val) => val !== null, {
        message: "WarnEttID ist erforderlich, wenn MatKatID 12 ist.",
        path: ["WarnEttID"]
    }).optional(),
    Warnettikettname: zod_1.z.string().nullable().refine((val) => val !== null, {
        message: "Warnettikettname ist erforderlich, wenn MatKatID 12 ist.",
        path: ["Warnettikettname"]
    }).optional()
});
const KategorieSchema = zod_1.z.object({
    MatKatID: zod_1.z.number()
        .min(1, { message: "MatKatID muss mindestens 1 sein" })
        .max(13, { message: "MatKatID darf maximal 13 sein" }),
    Kategorie: zod_1.z.enum(["Wachs", "Docht", "Behältnis", "Gemisch", "Öl", "Deckel", "WarnEtikett"]),
    Materialien: zod_1.z.array(MaterialSchema)
});
exports.inventarSchema = zod_1.z.object({
    Inventar: zod_1.z.array(KategorieSchema)
});
//# sourceMappingURL=inventar.js.map