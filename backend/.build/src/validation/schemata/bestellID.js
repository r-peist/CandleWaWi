"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bestellIDSchema = void 0;
const zod_1 = require("zod");
exports.bestellIDSchema = zod_1.z.object({
    BestellID: zod_1.z.object({
        BestellID: zod_1.z.number(),
    }),
});
//# sourceMappingURL=bestellID.js.map