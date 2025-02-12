import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json() // Logs im JSON-Format
  ),
  transports: [
    new transports.Console(), // Logs in die Konsole
    new transports.File({ filename: "logs/combined.log" }), // Alle Logs lokal speichern
    new transports.File({ filename: "logs/error.log", level: "error" }), // Fehler-Logs lokal speichern
  ],
});

export default logger;
