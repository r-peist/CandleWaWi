"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json() // Logs im JSON-Format
    ),
    transports: [
        new winston_1.transports.Console(), // Logs in die Konsole
        new winston_1.transports.File({ filename: "logs/combined.log" }), // Alle Logs lokal speichern
        new winston_1.transports.File({ filename: "logs/error.log", level: "error" }), // Fehler-Logs lokal speichern
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map