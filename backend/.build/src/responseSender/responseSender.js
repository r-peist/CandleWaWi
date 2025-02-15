"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseSender = void 0;
const Errors = __importStar(require("../error/errors"));
const responseSender = async (event) => {
    try {
        // JSON-Daten aus dem Request-Body lesen
        const data = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        console.log("Erhaltene Daten im responseSender: ");
        console.dir(data, { depth: null, colors: true });
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Daten erfolgreich ans FE gesendet",
                data, // Die empfangenen Daten werden direkt zurückgegeben
            }),
        };
    }
    catch (error) {
        return Errors.handleError(error, "responseSender");
    }
};
exports.responseSender = responseSender;
//# sourceMappingURL=responseSender.js.map