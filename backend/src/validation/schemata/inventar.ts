import { z } from "zod";

const materialSchema = z.object({
  MatID: z.number(),
  Materialname: z.string().min(1, { message: "Materialname ist erforderlich" }),
  // SKU darf null sein, daher verwenden wir nullable() – alternativ auch optional()
  SKU: z.string().nullable(),
  Active: z.string().min(1, { message: "Active ist erforderlich" }),
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
