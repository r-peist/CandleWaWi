// Schema Bestellung
import { z } from "zod";

// Schema für Materialien
const materialSchema = z.object({
    MatID: z.number().min(1, "MatID muss eine positive Zahl sein."),
    Menge: z.number().min(1, "Menge muss mindestens 1 sein."),
});

// Hauptschema für den JSON-Body
export const bestellungSchema = z.object({
    Bestellung: z.object({
        LiefID: z.number().min(1, "LiefID muss eine positive Zahl sein."),
        LagerID: z.number().min(1, "LagerID muss eine positive Zahl sein."),
        Benutzer: z.string().min(1, "Benutzer muss hinterlegt sein."),
        Datum: z.string().refine(
            (date) => !isNaN(Date.parse(date)),
            "Datum muss ein gültiges Datumsformat sein (YYYY-MM-DD)."
        ),
        Materialien: z
            .array(materialSchema)
            .min(1, "Mindestens ein Material muss angegeben werden."),
    })
});