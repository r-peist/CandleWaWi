"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invkorrWESchema = void 0;
const zod_1 = require("zod");
exports.invkorrWESchema = zod_1.z.object({
    InvKorrWE: zod_1.z.object({
        Kommentar: zod_1.z.string(),
        Datum: zod_1.z.string(),
        Benutzer: zod_1.z.string(),
        BestellID: zod_1.z.number(),
    }),
});
//# sourceMappingURL=invkorrWE.js.map