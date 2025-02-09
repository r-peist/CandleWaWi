import { z } from 'zod';

// Definition des Schemas für ein einzelnes Inventarobjekt
const schemaInventar = z.object({
  Material: z.string(),
  Kategorie: z.string(),
  MaterialKategorie: z.string(),
  Lager: z.string(),
  Menge: z.number().nonnegative(),
  Status: z.string(),
});

// Definition des Schemas für das gesamte Inventar
export const inventorySchema = z.object({
    Inventar: z.array(schemaInventar),
  });
