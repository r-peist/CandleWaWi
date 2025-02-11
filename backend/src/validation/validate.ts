import { APIGatewayEvent } from "aws-lambda";
import { z, ZodSchema } from "zod";
import * as Errors from "../error/errors";
import * as Schemas from "./schemata/index"; // Importiert alle Schemata aus dem Unterordner "schemata"
import { ValidatedEvent } from "../interfaces";

/**
 * Allgemeine Validierungs-Middleware für einkommende Daten aus dem FE die über den Wrapper verarbeitet werden.
 *
 * @param schemaName - Der Name des Schemas, das für die Validierung verwendet werden soll.
 *                    Dieser Name muss einem der exportierten Schemata in ./schemata entsprechen.
 * @param handler - Die Hauptfunktion, die ausgeführt wird, wenn die Validierung erfolgreich ist.
 */
export const validate = <T>(
  schemaName: keyof typeof Schemas,
  handler: (event: ValidatedEvent<T>) => Promise<any>
) => {
  // Hole das Schema aus dem Schemas-Objekt
  const schema: ZodSchema<T> = Schemas[schemaName] as unknown as ZodSchema<T>;

  return async (event: { body: string; [key: string]: any }) => {
    try {
      // JSON-Body parsen
      const body = JSON.parse(event.body || "{}");
      // Validierung mit dem entsprechenden Schema
      const validation = schema.safeParse(body);

      if (!validation.success) {
        console.error("Validation Error Details:", validation.error.errors);
        // Hier könnte man auch einen speziellen ValidationError werfen
        throw new Error("Validation failed");
      } else {
        console.log("Validierung der Daten aus Frontend erfolgreich!")
      }

      // Rufe den übergebenen Handler mit den validierten Daten auf
      return handler({ ...event as APIGatewayEvent, validatedBody: validation.data } as ValidatedEvent<T>);
    } catch (error) {
      return Errors.handleError(error, "validate");
    }
  };
};

/**
 * Validiert einzelne Daten und gibt validierte Daten wieder zurück.
 * Wirft einen Fehler, falls die Validierung fehlschlägt.
 *
 * @param schemaName - Name des Schemas, das verwendet werden soll.
 * @param data - Die zu validierenden Daten.
 * @returns Das validierte Objekt (getypt als T).
 */
export const validateData = <T>(schemaName: keyof typeof Schemas, data: unknown): T => {
  const schema: ZodSchema<T> = Schemas[schemaName] as unknown as ZodSchema<T>;
  const validation = schema.safeParse(data);
  
  if (!validation.success) {
    console.error("Validation Error Details:", validation.error.errors);
    // Rufe dein Errorhandling auf (z.B. für Logging) und werfe anschließend einen Fehler.
    Errors.handleError(new Error("Validation failed: " + JSON.stringify(validation.error.errors)), "validateEinzelDatei");
    throw new Error("Validation failed");
  } else {
    console.log("Validierung der Daten aus dem Handler erfolgreich!")
    return validation.data;
  }
};
