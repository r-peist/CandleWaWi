import { nullable, z } from "zod";

const materialSchema = z.object({
  MatID: z.number(),
  Materialname: z.string().min(1, { message: "Materialname ist erforderlich" }),
  // SKU darf null sein, daher verwenden wir nullable() – alternativ auch optional()
  SKU: z.string().nullable(),
  Active: z.string().min(1, { message: "Active ist erforderlich" }),
  LagerID: z.number().positive({ message: "LagerID muss eine positive Zahl sein" }), // Muss positiv sein
  Lagername: z.string().min(1, { message: "Lagername ist erforderlich" }), // Muss vorhanden sein
  Menge: z.number().nonnegative({ message: "Menge muss 0 oder größer sein" }), // Muss 0 oder positiv sein
  /* DochtID: z.number().nullable(),
  Dochtname: z.string().nullable(),
  BehaelterID: z.number().nullable(),
  Behaeltername: z.string().nullable(),
  DeckelID: z.number().nullable(),
  Deckelname: z.string().nullable(),
  WarnEttID: z.number().nullable(),
  Warnettikettname: z.string().nullable() */
});

const inventarItemSchema = z.object({
  MatKatID: z.number()
    .min(1, { message: "MatKatID muss mindestens 1 sein" })
    .max(13, { message: "MatKatID darf maximal 13 sein" }),
  Kategorie: z.string().min(1, { message: "Kategorie ist erforderlich" }),
  Materialien: z.array(materialSchema),
});

export const inventarSchema = z.object({
  Inventar: z.array(inventarItemSchema),
});
