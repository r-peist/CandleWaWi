import { z } from "zod";

// Schema für ein einzelnes Material
const materialSchema = z.object({
  MatID: z.number(),
  Name: z.string(),
  Menge: z.number(),
});

// Schema für eine Bestellung
const bestellungSchema = z.object({
  BestellID: z.number(),
  LiefID: z.number(),
  LagerID: z.number(),
  // Datum wird aus DB als Typ date gelesen, daher auch so weiter verwendet.
  Bestelldatum: z.date().refine(
    (date) => !isNaN(date.getTime()),
    { message: "Bestelldatum muss ein gültiges Datum sein" }
  ),
  // Materialien dürfen nicht leer sein – das erzwingt nonempty()
  Materialien: z.array(materialSchema).nonempty({ message: "Materialien dürfen nicht leer sein" }),
});

// Schema für den Wareneingang, der zwei Arrays enthält: "offen" und "pruefung"
// Beide Arrays dürfen leer sein, da wir hier nicht mit .nonempty() arbeiten.
const statusSchema = z.object({
  offen: z.array(bestellungSchema),
  pruefung: z.array(bestellungSchema),
});

// Das Gesamtschema, das ein Objekt mit der Eigenschaft "Wareneingang" erwartet
export const wareneingangSchema = z.object({
  Wareneingang: statusSchema,
});
