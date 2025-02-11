import { APIGatewayEvent } from "aws-lambda";

//Generisches Interface auch wenn kein Typ des events angegeben ist
export interface ValidatedEvent<T = Record<string, unknown>> extends Omit<APIGatewayEvent, 'body'> {
  validatedBody: T;
}

//Interfaces für src/handler/Wareneingang/handlerWareneingang
export interface Material {
  MatID: number;
  Name: string;
  Menge: number;
}
export interface Bestellung {
  BestellID: number;
  LiefID: number;
  LagerID: number;
  Bestelldatum: string;
  Materialien: Material[];
}
export interface BestellungenStatus {
  Wareneingang: {
    offen: Bestellung[];
    pruefung: Bestellung[];
  }
}

