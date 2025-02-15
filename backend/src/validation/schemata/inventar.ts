import { z } from "zod";

const MaterialSchema = z.object({
  MatID: z.number(),
  Materialname: z.string().min(1, { message: "Materialname ist erforderlich" }),
  SKU: z.string().nullable(),
  Active: z.string().min(1, { message: "Active ist erforderlich" }),
  LagerID: z.number().positive({ message: "LagerID muss eine positive Zahl sein" }),
  Lagername: z.string().min(1, { message: "Lagername ist erforderlich" }),
  Menge: z.number().nonnegative({ message: "Menge muss 0 oder größer sein" }),
  DochtID: z.number().nullable().refine((val) => val !== null, {
    message: "DochtID ist erforderlich, wenn MatKatID 3 ist.",
    path: ["DochtID"]
  }).optional(),
  Dochtname: z.string().nullable().refine((val) => val !== null, {
    message: "Dochtname ist erforderlich, wenn MatKatID 3 ist.",
    path: ["Dochtname"]
  }).optional(),
  BehaelterID: z.number().nullable().refine((val) => val !== null, {
    message: "BehaelterID ist erforderlich, wenn MatKatID 4 ist.",
    path: ["BehaelterID"]
  }).optional(),
  Behaeltername: z.string().nullable().refine((val) => val !== null, {
    message: "Behaeltername ist erforderlich, wenn MatKatID 4 ist.",
    path: ["Behaeltername"]
  }).optional(),
  DeckelID: z.number().nullable().refine((val) => val !== null, {
    message: "DeckelID ist erforderlich, wenn MatKatID 11 ist.",
    path: ["DeckelID"]
  }).optional(),
  Deckelname: z.string().nullable().refine((val) => val !== null, {
    message: "Deckelname ist erforderlich, wenn MatKatID 11 ist.",
    path: ["Deckelname"]
  }).optional(),
  WarnEttID: z.number().nullable().refine((val) => val !== null, {
    message: "WarnEttID ist erforderlich, wenn MatKatID 12 ist.",
    path: ["WarnEttID"]
  }).optional(),
  Warnettikettname: z.string().nullable().refine((val) => val !== null, {
    message: "Warnettikettname ist erforderlich, wenn MatKatID 12 ist.",
    path: ["Warnettikettname"]
  }).optional()
});

const KategorieSchema = z.object({
  MatKatID: z.number()
    .min(1, { message: "MatKatID muss mindestens 1 sein" })
    .max(13, { message: "MatKatID darf maximal 13 sein" }),
  Kategorie: z.enum(["Wachs", "Docht", "Behältnis", "Gemisch", "Öl", "Deckel", "WarnEtikett"]),
  Materialien: z.array(MaterialSchema)
});

export const inventarSchema = z.object({
  Inventar: z.array(KategorieSchema)
});
