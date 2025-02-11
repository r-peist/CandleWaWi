import { z } from "zod";

export const bestellIDSchema = z.object({
  BestellID: z.object({
    BestellID: z.number(),
  }),
});
