// validatedHandlers.ts
import { validate } from "./validate";
import { handlerMatLief } from "../handler/Einkauf/handlerMatLief";
import { handlerBestellung } from "../handler/Einkauf/handlerBestellung";
import { handlerBuchung } from "../handler/Wareneingang/handlerBuchung";
import { handlerInvKorrWE } from "../handler/Wareneingang/handlerInvKorrWE";
import { handlerUpsertRezept } from "../handler/Herstellung/Neuentwicklung/handlerUpsertRezept";
import { handlerHerstellung } from "../handler/Herstellung/Herstellung/handlerHerstellung";

export const validatedGetLieferantFE = validate("lieferantSchema", handlerMatLief);
export const validatedGetMatLief = validate("bestellungSchema", handlerBestellung);
export const validatedGetBuchung = validate("buchungSchema", handlerBuchung);
export const validateGetInvKorrWE = validate("invkorrWESchema", handlerInvKorrWE);
export const validateUpsertRezept = validate("upsertRezeptSchema", handlerUpsertRezept);
export const validateHerstellung = validate("herstellenSchema", handlerHerstellung);