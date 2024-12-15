"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processData = void 0;
const processData = (dataLieferant) => {
    try {
        // Beispiel: Daten einfach ausgeben
        console.log("Wrapper empfängt JSON-Daten:", dataLieferant);
        // Hier kannst du die Daten speichern, transformieren oder weiterleiten
        // z.B. in eine Datei schreiben oder an einen externen API-Endpunkt senden
    }
    catch (error) {
        console.error("Fehler beim Verarbeiten der Daten im Wrapper:", error);
    }
};
exports.processData = processData;
