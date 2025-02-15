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

//Interfaces für src/handler/Herstellung/Neuentwicklung/handlerGetRezept.ts
export interface RezeptKerze {
  RezeptKerzeID: number,
  Name: string,
  MatID: number,
  Name_Mat: string,
  BehaelterID: number,
  Behaelter_name: string,
  DeckelID: number,
  Deckel_name: string,
  DochtID: number,
  Docht_name: string,
  WarnEttID: number,
  WarnEtt_name: string,
  ZPRezeptID: number,
  ZP_name: string
}

export interface RezeptSprayDiff {
  RezeptSprayDifID: number,
  Name: string,
  BehaelterID: number,
  Behaelter_name: string,
  DeckelID: number,
  Deckel_name: string,
  WarnEttID: number,
  WarnEtt_name: string,
  ZPRezeptID1: number,
  ZP_name1: string,
  ZPRezeptID2: number,
  ZP_name2: string,
}

export interface RezeptZP {
  ZPRezeptID: number,
  Name: string,
  Beschreibung: string,
  Releasedate: Date,
  Changedate: Date,
  Zutaten: Zutaten[]
}

export interface Zutaten {
  MatID: number,
  Menge: number
}