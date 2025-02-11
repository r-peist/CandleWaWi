// validatedHandlers.ts
import { validate } from "./validate";
import { getMatLief } from "../handler/Einkauf/handlerGetMatLief";
import { handlerBestellung } from "../handler/Einkauf/handlerBestellung";

export const validatedGetLieferantFE = validate("lieferantSchema", getMatLief);
export const validatedGetMatLief = validate("bestellungSchema", handlerBestellung);

// Beispiel für einen weiteren Endpunkt, der Daten enthält (z. B. Inventardaten)
// Angenommen, dein Schema heißt "inventorySchema" und dein Handler heißt inventoryHandler

//export const validatedInventoryHandler = validate("inventorySchema", inventoryHandler);

// Weitere validierte Handler können hier analog definiert werden.
