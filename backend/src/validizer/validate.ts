// validate.ts
import { z, ZodSchema } from "zod";
import { ValidationError } from "../error/errors"; 

/**
 * Allgemeine Validierungs-Middleware
 *
 * @param schema - Das `zod`-Schema zur Validierung.
 * @param handler - Die Hauptfunktion, die ausgeführt wird, wenn die Validierung erfolgreich ist.
 */
export const validate = <T>(
    schema: ZodSchema<T>,
    handler: (event: { validatedBody: T; [key: string]: any }) => Promise<any>
) => {
    return async (event: { body: string; [key: string]: any }) => {
        try {
            // JSON-Body parsen
            const body = JSON.parse(event.body || "{}");

            // Eingabe validieren
            const validation = schema.safeParse(body);

            if (!validation.success) {
                const errorDetails = validation.error.errors;
                console.error("Validation Error Details:", errorDetails); // Fehlerdetails ausgeben
                throw new ValidationError("Validation failed", errorDetails);
            }

            // Hauptfunktion mit validierten Daten ausführen
            return handler({ ...event, validatedBody: validation.data });
        } catch (error) {
            if (error instanceof ValidationError) {
                return {
                    statusCode: error.statusCode,
                    body: JSON.stringify({
                        error: error.message,
                        details: (error as any).details,
                    }),
                };
            }

            console.error("Validation or Execution Error:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Internal Server Error" }),
            };
        }
    };
};
