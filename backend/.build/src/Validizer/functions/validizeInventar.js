"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInventar = void 0;
const schemaInventar_1 = require("../schemata/schemaInventar"); // Passendes Schema für die Antwort
// Funktion zum Validieren der DB-Daten
const validateInventar = (data) => {
    /* try {
        const sendInventar = JSON.parse(data || "{}");
    } catch (error) {
        console.error("Fehler beim Parsen der JSON-Daten:", error);
        throw new Error("Ungültiges JSON-Format in validateInventar");
    } */
    console.log("Daten in validize: ", data);
    const validation = schemaInventar_1.inventorySchema.safeParse(data);
    if (!validation.success) {
        console.error("Validierungsfehler:", validation.error.errors);
        throw new Error("Ungültige Daten aus der Validierung in validizeInventar");
    }
    console.log("Erhaltene validierte Daten: ", validation.data);
    return data;
};
exports.validateInventar = validateInventar;
//# sourceMappingURL=validizeInventar.js.map