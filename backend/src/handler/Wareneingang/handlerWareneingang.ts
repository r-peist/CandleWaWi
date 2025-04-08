import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { closePool, getConnection } from "../../db/dbclient"; // Importiere den DB-Wrapper
import * as Errors from "../../error/errors";
import { validateData } from "../../validation/validate";
import { MaterialBest, Bestellung, BestellungenStatus } from "../../interfaces";

export const handlerWareneingang = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  let connection;  

  // Initialisierung des Bestellungen-Objekts
  const Bestellungen: BestellungenStatus = {
    Wareneingang: {
      offen: [],
      pruefung: []
    }
  };

  try {
    connection = await getConnection();

    // SQL-Abfrage für die Bestellungen mit Status 'offen' oder 'in_pruefung'
    const queryBestellungen = `
      SELECT BestellID, LiefID, LagerID, Bestelldatum, Status
      FROM bestellung
      WHERE Status = 'offen' OR Status = 'pruefung'
    `;
    const [bestellRows]: any = await connection.execute(queryBestellungen);

    // Iteration über die abgerufenen Bestellungen
    for (const bestellung of bestellRows) {
      let i = 1;
      const { BestellID, LiefID, LagerID, Bestelldatum, Status } = bestellung;

      // SQL-Abfrage für die Materialien der aktuellen Bestellung
      const queryMaterialien = `
        SELECT m.MatID, m.Name, mb.Menge
        FROM materialbestellung mb
        JOIN material m ON mb.MatID = m.MatID
        WHERE mb.BestellID = ?
      `;
      const [materialRows]: any = await connection.execute(queryMaterialien, [BestellID]);

      let materialien: MaterialBest = {
        MatID: 0,
        Name: "",
        Menge: 0,
      };

      // Erstellung des Bestellobjekts
      const bestellObjekt: Bestellung = {
        BestellID: BestellID,
        LiefID: LiefID,
        LagerID: LagerID,
        Bestelldatum: Bestelldatum,
        Materialien: []
      };

      for (const material of materialRows) {
        const { MatID, Name, Menge } = material;
        materialien.MatID = MatID;
        materialien.Name = Name;
        materialien.Menge = Menge;
        bestellObjekt.Materialien.push(materialien);
        
        console.log("ID: ", MatID, " Name: ", Name, " Menge: ", Menge);
      }
      console.log("Material: ", JSON.stringify(bestellObjekt.Materialien[0]));
      i++;

      // Hinzufügen des Bestellobjekts zum entsprechenden Status-Array
      if (Status === 'offen') {
        Bestellungen.Wareneingang.offen.push(bestellObjekt);
      } else if (Status === 'pruefung') {
        Bestellungen.Wareneingang.pruefung.push(bestellObjekt);
      }
      
    }

    const validatedData = validateData("wareneingangSchema", Bestellungen)

    console.log("Zu verschickende Daten aus handlerWareneingang: ", JSON.stringify(validatedData, null, 2));

    // HTTP-Post-Aufruf mit node-fetch
    const response = await fetch("https://refuv4aan4.execute-api.eu-central-1.amazonaws.com/dev/responseSender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    // Erfolgreiche Antwort mit den zusammengestellten Bestellungen
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Bestellungen erfolgreich abgerufen.",
        data: Bestellungen
      }),
    };
  } catch (error) {
    return Errors.handleError(error, "handlerWareneingang");
  } finally {
    // Verbindung freigeben
    if (connection) {
      connection.release();
    }
    await closePool();
  }
};