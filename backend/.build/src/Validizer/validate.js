"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const errors_1 = require("../error/errors");
/**
 * Allgemeine Validierungs-Middleware
 *
 * @param schema - Das `zod`-Schema zur Validierung.
 * @param handler - Die Hauptfunktion, die ausgeführt wird, wenn die Validierung erfolgreich ist.
 */
const validate = (schema, handler) => {
    return async (event) => {
        try {
            // JSON-Body parsen
            const body = JSON.parse(event.body || "{}");
            // Eingabe validieren
            const validation = schema.safeParse(body);
            if (!validation.success) {
                const errorDetails = validation.error.errors;
                console.error("Validation Error Details:", errorDetails); // Fehlerdetails ausgeben
                throw new errors_1.ValidationError("Validation failed", errorDetails);
            }
            // Hauptfunktion mit validierten Daten ausführen
            return handler({ ...event, validatedBody: validation.data });
        }
        catch (error) {
            if (error instanceof errors_1.ValidationError) {
                return {
                    statusCode: error.statusCode,
                    body: JSON.stringify({
                        error: error.message,
                        details: error.details,
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
exports.validate = validate;
//# sourceMappingURL=validate.js.map