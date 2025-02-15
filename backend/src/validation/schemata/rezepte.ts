import { z } from "zod";

// Schema für einzelne Zutaten (im ZP-Objekt)
const zutatenSchema = z.object({
  MatID: z.number(),
  Name: z.string().min(1, { message: "Name is required" }),
  Menge: z.number().gt(0, { message: "Menge muss größer als 0 sein" }),
});

// Schema für ein ZP-Objekt
const zpSchema = z.object({
  ZPRezeptID: z.number(),
  Name: z.string().min(1, { message: "Name is required" }),
  Beschreibung: z.string().min(1, { message: "Beschreibung is required" }),
  Releasedate: z.date({ invalid_type_error: "Changedate must be a valid date" }),
  Changedate: z.date({ invalid_type_error: "Changedate must be a valid date" }),
  // Zutaten darf nicht leer sein:
  Zutaten: z.array(zutatenSchema).nonempty({ message: "Zutaten array must not be empty" }),
});

// Schema für ein Kerze-Objekt
const kerzeSchema = z.object({
  RezeptKerzeID: z.number(),
  Name: z.string().min(1, { message: "Name is required" }),
  MatID: z.number(),
  Name_Mat: z.string().min(1, { message: "Name_Mat is required" }),
  BehaelterID: z.number(),
  Behaelter_name: z.string().min(1, { message: "Behaelter_name is required" }),
  DeckelID: z.number(),
  Deckel_name: z.string().min(1, { message: "Deckel_name is required" }),
  DochtID: z.number(),
  Docht_name: z.string().min(1, { message: "Docht_name is required" }),
  WarnEttID: z.number(),
  WarnEtt_name: z.string().min(1, { message: "WarnEtt_name is required" }),
  ZPRezeptID: z.number(),
  ZP_name: z.string().min(1, { message: "ZP_name is required" }),
});

// Schema für ein SprayDiff-Objekt
const sprayDiffSchema = z.object({
  RezeptSprayDifID: z.number(),
  Name: z.string().min(1, { message: "Name is required" }),
  BehaelterID: z.number(),
  Behaelter_name: z.string().min(1, { message: "Behaelter_name is required" }),
  DeckelID: z.number(),
  Deckel_name: z.string().min(1, { message: "Deckel_name is required" }),
  WarnEttID: z.number(),
  WarnEtt_name: z.string().min(1, { message: "WarnEtt_name is required" }),
  ZPRezeptID1: z.number(),
  ZP_name1: z.string().min(1, { message: "ZP_name1 is required" }),
  ZPRezeptID2: z.number(),
  ZP_name2: z.string().min(1, { message: "ZP_name2 is required" }),
});

// Gesamtschema für Rezept
export const rezepteSchema = z.object({
  Rezept: z.object({
    Kerze: z.array(kerzeSchema),        // darf leer sein
    SprayDiff: z.array(sprayDiffSchema),  // darf leer sein
    ZP: z.array(zpSchema)                // darf leer sein
  })
});
