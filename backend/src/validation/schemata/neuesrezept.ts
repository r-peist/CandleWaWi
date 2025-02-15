import { z } from "zod";

// Schema für einzelne Zutaten (im ZP-Objekt)
const zutatenSchema = z.object({
  MatID: z.number(),
  Menge: z.number().gt(0, { message: "Menge muss größer als 0 sein" }),
});

// Schema für ein ZP-Objekt
const zpSchema = z.object({
  ZPRezeptID: z.number().optional(),
  Name: z.string().min(1, { message: "Name is required" }),
  Beschreibung: z.string().min(1, { message: "Beschreibung is required" }),
  Releasedate: z.string().optional(), //Bei Update leer
  Changedate: z.string().optional(), //Bei Insert leer
  // Zutaten darf nicht leer sein:
  Zutaten: z.array(zutatenSchema).nonempty({ message: "Zutaten array must not be empty" }),
});

// Schema für ein Kerze-Objekt
const kerzeSchema = z.object({
  RezeptKerzeID: z.number().optional(),
  Name: z.string().min(1, { message: "Name is required" }),
  MatID: z.number(),
  Name_Mat: z.string().min(1, { message: "Name_Mat is required" }),
  BehaelterID: z.number(),
  Behaelter_name: z.string().min(1, { message: "Behaelter_name is required" }),
  DeckelID: z.number(),
  Deckel_name: z.string().min(1, { message: "Deckel_name is required" }),
  DochtID: z.number(),
  Docht_name: z.string().min(1, { message: "Docht_name is required" }),
  WarnEttID: z.number().refine((val) => val === 1, { message: "WarnEttID muss den Wert 1 haben" }),
  WarnEtt_name: z.string().min(1, { message: "WarnEtt_name is required" }),
  ZPRezeptID: z.number(),
  ZP_name: z.string().min(1, { message: "ZP_name is required" }),
});

// Schema für ein SprayDiff-Objekt
const sprayDiffSchema = z.object({
  RezeptSprayDifID: z.number().optional(),
  Name: z.string().min(1, { message: "Name is required" }),
  BehaelterID: z.number(),
  Behaelter_name: z.string().min(1, { message: "Behaelter_name is required" }),
  DeckelID: z.number(),
  Deckel_name: z.string().min(1, { message: "Deckel_name is required" }),
  WarnEttID: z.number().refine((val) => val === 2, { message: "WarnEttID muss den Wert 2 haben" }),
  WarnEtt_name: z.string().min(1, { message: "WarnEtt_name is required" }),
  ZPRezeptID1: z.number(),
  ZP_name1: z.string().min(1, { message: "ZP_name1 is required" }),
  ZPRezeptID2: z.number(),
  ZP_name2: z.string().min(1, { message: "ZP_name2 is required" }),
});

// Gesamtschema für Rezept
export const upsertRezeptSchema = z.object({
    Rezept: z.object({
      Kerze: kerzeSchema.optional(),        // Optionales Objekt, darf fehlen
      SprayDiff: sprayDiffSchema.optional(),  // Optionales Objekt, darf fehlen
      ZP: zpSchema.optional()                // Optionales Objekt, darf fehlen
    }).refine((data) => {
      // Es muss genau ein Objekt unter Kerze, SprayDiff oder ZP vorhanden sein
      const present = [data.Kerze, data.SprayDiff, data.ZP].filter(x => x !== undefined);
      return present.length === 1;
    }, {
      message: "Es muss genau ein Objekt (Kerze, SprayDiff oder ZP) vorhanden sein",
      path: [] // Fehler auf Rezept-Ebene
    })
});