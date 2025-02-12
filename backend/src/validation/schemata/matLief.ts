import { z } from "zod";

export const matLiefSchema = z.object({
  MatLiefs: z.array(
    z.object({
      MatLiefID: z.number(),
      MatID: z.number(),
      LiefID: z.number(),
      Link: z.string().url(), // Optional: URL-Validierung, falls gewünscht
      MaterialName: z.string(),
      LieferantName: z.string(),
    })
  )
});
