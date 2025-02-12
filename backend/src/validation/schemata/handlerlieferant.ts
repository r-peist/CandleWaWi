import { z } from "zod";

export const handlerlieferantSchema = z.object({
  Lieferanten: z.array(
    z.object({
      LiefID: z.number(),
      Name: z.string(),
    })
  ),
});
