import { z } from "zod";

// Schema für einzelne Elemente im InvKorrMats-Array
const invKorrMatSchema = z.object({
  MatID: z.number(),
  Name: z.string(),
  Menge: z.number(),
  neue_Menge: z.number(), // Negative Werte sind erlaubt
  Kommentar: z.string(),
  Datum: z.date(),
  Benutzer: z.string(),
});

// Schema für einzelne Materialien innerhalb von InvKorrBest
const materialSchemaForBest = z.object({
  MatID: z.number(),
  Name: z.string(),
  Menge: z.number(),
  neue_Menge: z.number(), // Negative Werte sind erlaubt
});

// Schema für einzelne Elemente im InvKorrBest-Array
const invKorrBestSchema = z.object({
  BestellID: z.number(),
  Kommentar: z.string(),
  Datum: z.date(),
  Benutzer: z.string(),
  // Materialien darf nicht leer sein:
  Material: z.array(materialSchemaForBest).nonempty({ message: "Materialien dürfen nicht leer sein" }),
});

// Gesamtschema für Inventarkorrektur
export const getInvKorrSchema = z.object({
  Inventarkorrektur: z.object({
    InvKorrMats: z.array(invKorrMatSchema),
    InvKorrBest: z.array(invKorrBestSchema),
  }),
});
