"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buchungSchema = void 0;
const zod_1 = require("zod");
exports.buchungSchema = zod_1.z.object({
    Buchung: zod_1.z.object({
        BestellID: zod_1.z.number(),
    }),
});
//# sourceMappingURL=buchung.js.map