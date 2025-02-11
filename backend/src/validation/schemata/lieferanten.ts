import { z } from "zod";

export const lieferantSchema = z.object({
  Lieferant: z.object({
    LiefID: z.number(),
  }),
});

