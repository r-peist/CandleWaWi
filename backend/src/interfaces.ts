import { APIGatewayEvent } from "aws-lambda";

//Generisches Interface auch wenn kein Typ des events angegeben ist
export interface ValidatedEvent<T = Record<string, unknown>> extends Omit<APIGatewayEvent, 'body'> {
  validatedBody: T;
}

//Interfaces für src/handler/Wareneingang/handlerWareneingang.ts
export interface MaterialBest {
  MatID: number;
  Name: string;
  Menge: number;
}
export interface Bestellung {
  BestellID: number;
  LiefID: number;
  LagerID: number;
  Bestelldatum: string;
  Materialien: MaterialBest[];
}
export interface BestellungenStatus {
  Wareneingang: {
    offen: Bestellung[];
    pruefung: Bestellung[];
  }
}

//Interfaces für src/handler/Inventarkorrektur/handlerGetInvKorr.ts
export interface InvKorrMats {
  MatID: number;
  Name: string;
  Menge: number;
  neue_Menge: number;
  Kommentar: string;
  Datum: string;
  Benutzer: string;
}

export interface InvKorrBest {
  BestellID: number;
  Kommentar: string;
  Datum: string;
  Benutzer: string;
  Material: MaterialInvKorr[];
}

export interface MaterialInvKorr {
  MatID: number;
  Name: string;
  Menge: string;
  neue_Menge: string;
}

