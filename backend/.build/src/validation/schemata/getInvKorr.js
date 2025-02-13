"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvKorrSchema = void 0;
const zod_1 = require("zod");
// Schema für einzelne Elemente im InvKorrMats-Array
const invKorrMatSchema = zod_1.z.object({
    MatID: zod_1.z.number(),
    Name: zod_1.z.string(),
    Menge: zod_1.z.number(),
    neue_Menge: zod_1.z.number(), // Negative Werte sind erlaubt
    Kommentar: zod_1.z.string(),
    Datum: zod_1.z.date(),
    Benutzer: zod_1.z.string(),
});
// Schema für einzelne Materialien innerhalb von InvKorrBest
const materialSchemaForBest = zod_1.z.object({
    MatID: zod_1.z.number(),
    Name: zod_1.z.string(),
    Menge: zod_1.z.number(),
    neue_Menge: zod_1.z.number(), // Negative Werte sind erlaubt
});
// Schema für einzelne Elemente im InvKorrBest-Array
const invKorrBestSchema = zod_1.z.object({
    BestellID: zod_1.z.number(),
    Kommentar: zod_1.z.string(),
    Datum: zod_1.z.date(),
    Benutzer: zod_1.z.string(),
    // Materialien darf nicht leer sein:
    Material: zod_1.z.array(materialSchemaForBest).nonempty({ message: "Materialien dürfen nicht leer sein" }),
});
// Gesamtschema für Inventarkorrektur
exports.getInvKorrSchema = zod_1.z.object({
    Inventarkorrektur: zod_1.z.object({
        InvKorrMats: zod_1.z.array(invKorrMatSchema),
        InvKorrBest: zod_1.z.array(invKorrBestSchema),
    }),
});
//# sourceMappingURL=getInvKorr.js.map