"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wareneingangSchema = void 0;
const zod_1 = require("zod");
// Schema für ein einzelnes Material
const materialSchema = zod_1.z.object({
    MatID: zod_1.z.number(),
    Name: zod_1.z.string(),
    Menge: zod_1.z.number(),
});
// Schema für eine Bestellung
const bestellungSchema = zod_1.z.object({
    BestellID: zod_1.z.number(),
    LiefID: zod_1.z.number(),
    LagerID: zod_1.z.number(),
    // Datum wird aus DB als Typ date gelesen, daher auch so weiter verwendet.
    Bestelldatum: zod_1.z.date().refine((date) => !isNaN(date.getTime()), { message: "Bestelldatum muss ein gültiges Datum sein" }),
    // Materialien dürfen nicht leer sein – das erzwingt nonempty()
    Materialien: zod_1.z.array(materialSchema).nonempty({ message: "Materialien dürfen nicht leer sein" }),
});
// Schema für den Wareneingang, der zwei Arrays enthält: "offen" und "pruefung"
// Beide Arrays dürfen leer sein, da wir hier nicht mit .nonempty() arbeiten.
const statusSchema = zod_1.z.object({
    offen: zod_1.z.array(bestellungSchema),
    pruefung: zod_1.z.array(bestellungSchema),
});
// Das Gesamtschema, das ein Objekt mit der Eigenschaft "Wareneingang" erwartet
exports.wareneingangSchema = zod_1.z.object({
    Wareneingang: statusSchema,
});
//# sourceMappingURL=wareneingang.js.map