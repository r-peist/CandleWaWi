"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rezepteSchema = void 0;
const zod_1 = require("zod");
// Schema für einzelne Zutaten (im ZP-Objekt)
const zutatenSchema = zod_1.z.object({
    MatID: zod_1.z.number(),
    Name: zod_1.z.string().min(1, { message: "Name is required" }),
    Menge: zod_1.z.number().gt(0, { message: "Menge muss größer als 0 sein" }),
});
// Schema für ein ZP-Objekt
const zpSchema = zod_1.z.object({
    ZPRezeptID: zod_1.z.number(),
    Name: zod_1.z.string().min(1, { message: "Name is required" }),
    Beschreibung: zod_1.z.string().min(1, { message: "Beschreibung is required" }),
    Releasedate: zod_1.z.date({ invalid_type_error: "Changedate must be a valid date" }),
    Changedate: zod_1.z.date({ invalid_type_error: "Changedate must be a valid date" }),
    // Zutaten darf nicht leer sein:
    Zutaten: zod_1.z.array(zutatenSchema).nonempty({ message: "Zutaten array must not be empty" }),
});
// Schema für ein Kerze-Objekt
const kerzeSchema = zod_1.z.object({
    RezeptKerzeID: zod_1.z.number(),
    Name: zod_1.z.string().min(1, { message: "Name is required" }),
    MatID: zod_1.z.number(),
    Name_Mat: zod_1.z.string().min(1, { message: "Name_Mat is required" }),
    BehaelterID: zod_1.z.number(),
    Behaelter_name: zod_1.z.string().min(1, { message: "Behaelter_name is required" }),
    DeckelID: zod_1.z.number(),
    Deckel_name: zod_1.z.string().min(1, { message: "Deckel_name is required" }),
    DochtID: zod_1.z.number(),
    Docht_name: zod_1.z.string().min(1, { message: "Docht_name is required" }),
    WarnEttID: zod_1.z.number(),
    WarnEtt_name: zod_1.z.string().min(1, { message: "WarnEtt_name is required" }),
    ZPRezeptID: zod_1.z.number(),
    ZP_name: zod_1.z.string().min(1, { message: "ZP_name is required" }),
});
// Schema für ein SprayDiff-Objekt
const sprayDiffSchema = zod_1.z.object({
    RezeptSprayDifID: zod_1.z.number(),
    Name: zod_1.z.string().min(1, { message: "Name is required" }),
    BehaelterID: zod_1.z.number(),
    Behaelter_name: zod_1.z.string().min(1, { message: "Behaelter_name is required" }),
    DeckelID: zod_1.z.number(),
    Deckel_name: zod_1.z.string().min(1, { message: "Deckel_name is required" }),
    WarnEttID: zod_1.z.number(),
    WarnEtt_name: zod_1.z.string().min(1, { message: "WarnEtt_name is required" }),
    ZPRezeptID1: zod_1.z.number(),
    ZP_name1: zod_1.z.string().min(1, { message: "ZP_name1 is required" }),
    ZPRezeptID2: zod_1.z.number(),
    ZP_name2: zod_1.z.string().min(1, { message: "ZP_name2 is required" }),
});
// Gesamtschema für Rezept
exports.rezepteSchema = zod_1.z.object({
    Rezept: zod_1.z.object({
        Kerze: zod_1.z.array(kerzeSchema), // darf leer sein
        SprayDiff: zod_1.z.array(sprayDiffSchema), // darf leer sein
        ZP: zod_1.z.array(zpSchema) // darf leer sein
    })
});
//# sourceMappingURL=rezepte.js.map