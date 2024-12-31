import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import fetch from "node-fetch";
import { validate } from "../validizer/validate";
import { BestellungSchema } from "../validizer/schemaBestellung";
import * as Errors from "../error/errors";
import { z } from "zod";
import logger from "../utils/logger";

// Typisierung für die validierten Bestelldaten
type BestellungType = z.infer<typeof BestellungSchema>;

const processBestellung = async (
  event: { validatedBody: BestellungType }
): Promise<APIGatewayProxyResult> => {
  try {
    // Überprüfen, ob der Body korrekt ist
    const bestellung = event.validatedBody;
    logger.info("Empfangener Body aus dem Frontend für Bestellung:", bestellung);

    // HTTP-Post-Aufruf mit node-fetch
    const response = await fetch("http://localhost:3001/handlerBestellung", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bestellung }),
    });

    let responseBody;
    try {
      responseBody = await response.json();
    } catch (parseError) {
      throw new Errors.InternalServerError("Ungültige Antwort von Folgefunktion handlerBestellung", {
        rawResponse: await response.text(),
      });
    }

    if (!response.ok) {
      logger.info("Fehler aus Backend-Handler:", responseBody);

      // Spezifische Fehler basierend auf dem Statuscode
      switch (response.status) {
        case 502:
          throw new Errors.BadGatewayError(
            `Bad Gateway: Fehler im Backend-Handler`,
            responseBody
          );
        case 503:
          throw new Errors.ServiceUnavailableError(
            `Service Unavailable: Backend-Dienst nicht verfügbar`,
            responseBody
          );
        default:
          throw new Errors.InternalServerError(
            `Backend-Fehler: ${responseBody.error || response.status}`,
            responseBody
          );
      }
    }

    logger.info("Erfolgreiche Antwort aus Backend:", responseBody);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Bestelldaten erfolgreich vom FE erhalten und verarbeitet!",
        data: responseBody.data,
      }),
    };
  } catch (error) {
    console.error("Fehler beim Verarbeiten der Bestellung:", error);

    if (error instanceof Errors.CustomError) {
      // Behandlung von bekannten Fehlerklassen
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
          details: error.details,
        }),
      };
    }

    // Generischer Fallback für unbekannte Fehler
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Interner Serverfehler beim Verarbeiten der Anfrage!",
        error: error instanceof Error ? error.message : "Fehler beim Senden der Daten an handlerBestellung",
        details: {
          function: "getBestellung",
          input: event.validatedBody, // Original-Input des Clients
          timestamp: new Date().toISOString(),
          code: "FOLLOW_FUNCTION_ERROR",
          hints: "Prüfen Sie die Struktur des JSON-Bodys auf fehlende Pflichtfelder.",
        },
      }),
    };
  }  
};

// Middleware mit Funktionskontext
export const getBestellung = validate(BestellungSchema, processBestellung);
