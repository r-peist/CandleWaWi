"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLieferanten = void 0;
//Endpunkt im Frontend ist "sendLieferanten"
const sendLieferanten = async (event) => {
    try {
        // JSON-Daten aus dem Request-Body lesen
        const requestLieferanten = JSON.parse(event.body || "{}");
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Lieferantenrequest erhalten und Daten gesendet",
                receivedData: requestLieferanten, // Zurück an das Frontend
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
exports.sendLieferanten = sendLieferanten;
