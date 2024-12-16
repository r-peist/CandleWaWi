"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMatLief = void 0;
//Endpunkt im Frontend ist "sendLieferanten"
const sendMatLief = async (event) => {
    try {
        // JSON-Daten aus dem Request-Body lesen
        const sendMatLief = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        console.log("Erhaltene Daten sind hier:", sendMatLief);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Lieferantenrequest erhalten und Daten erfolgreich gesendet",
                sendMatLief
                //receivedData: requestLieferanten, // Zurück an das Frontend
            }),
        };
    }
    catch (error) {
        console.error("Fehler beim Verarbeiten der Lieferantenanfrage:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Fehler beim Verarbeiten der Lieferantenanfrage",
            }),
        };
    }
};
exports.sendMatLief = sendMatLief;
