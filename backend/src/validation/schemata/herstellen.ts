import { z } from "zod";

export const herstellenSchema = z.object({
  Rezept: z.object({
    Name: z.union([z.literal("Kerze"), z.literal("SprayDiff"), z.literal("ZP")], {
      errorMap: () => ({ message: "Name muss entweder 'Kerze', 'SprayDiff' oder 'ZP' sein" })
    }),
    RezeptID: z.number().positive({ message: "RezeptID muss eine positive Zahl sein" }),
    BehaelterID: z.number().optional(),
    DeckelID: z.number().optional(),
    MatID: z.number().optional(),
    Menge: z.number().optional(),
    Materialien: z.array(
      z.object({
        MatID: z.number(),
        Menge: z.number(),
      })
    ).optional(),
  })
});
