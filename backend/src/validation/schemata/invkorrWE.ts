import { z } from "zod";

export const invkorrWESchema = z.object({
  InvKorrWE: z.object({
    Kommentar: z.string(),
    Datum: z.string(),
    Benutzer: z.string(),
    BestellID: z.number(),
  }),
});
