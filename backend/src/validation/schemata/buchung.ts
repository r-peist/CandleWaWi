import { z } from "zod";

export const buchungSchema = z.object({
  Buchung: z.object({
    BestellID: z.number(),
  }),
});
