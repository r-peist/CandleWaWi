import { validate } from "../validate";  // Validierungs-Middleware
import { inventorySchema } from "../schemata/schemaInventar"; // Passendes Schema für die Antwort
import { handlerInventar } from "../../handler/handlerInventar"; // Funktion, die DB-Daten holt
import { APIGatewayEvent } from "aws-lambda";

// Funktion zum Validieren der DB-Daten
export const validateInventar = (data: any) => {
    /* try {
        const sendInventar = JSON.parse(data || "{}");      
    } catch (error) {
        console.error("Fehler beim Parsen der JSON-Daten:", error);
        throw new Error("Ungültiges JSON-Format in validateInventar");
    } */
    console.log("Daten in validize: ", data);
    const validation = inventorySchema.safeParse(data);
    if (!validation.success) {
        console.error("Validierungsfehler:", validation.error.errors);
        throw new Error("Ungültige Daten aus der Validierung in validizeInventar");
    }
    console.log("Erhaltene validierte Daten: ", validation.data); 
    return data;
};
