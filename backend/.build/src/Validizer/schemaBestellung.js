"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestellungSchema = void 0;
// Schema Bestellung
const zod_1 = require("zod");
// Schema für Materialien
const MaterialSchema = zod_1.z.object({
    MatID: zod_1.z.number().min(1, "MatID muss eine positive Zahl sein."),
    Menge: zod_1.z.number().min(1, "Menge muss mindestens 1 sein."),
});
// Hauptschema für den JSON-Body
exports.BestellungSchema = zod_1.z.object({
    LiefID: zod_1.z.number().min(1, "LiefID muss eine positive Zahl sein."),
    LagerID: zod_1.z.number().min(1, "LagerID muss eine positive Zahl sein."),
    Datum: zod_1.z.string().refine((date) => !isNaN(Date.parse(date)), "Datum muss ein gültiges Datumsformat sein (YYYY-MM-DD)."),
    Materialien: zod_1.z
        .array(MaterialSchema)
        .min(1, "Mindestens ein Material muss angegeben werden."),
});
//# sourceMappingURL=schemaBestellung.js.map