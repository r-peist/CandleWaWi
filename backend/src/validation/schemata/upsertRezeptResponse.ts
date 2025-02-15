import { z } from "zod";

export const updatedSchema = z.object({
  Updated: z.object({
    Rezept: z.enum(["Kerze", "SprayDiff", "ZP", "Fehler"], {
      errorMap: () => ({ message: "Rezept muss entweder 'Kerze', 'SprayDiff', 'ZP' oder 'Fehler' sein" })
    }),
    ID: z.number().nonnegative({ message: "ID muss 0 oder eine positive Zahl sein" }),
    message: z.string().min(1, { message: "Message darf nicht leer sein" })
  })
});
