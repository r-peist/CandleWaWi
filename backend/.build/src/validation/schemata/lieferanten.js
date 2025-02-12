"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lieferantSchema = void 0;
const zod_1 = require("zod");
exports.lieferantSchema = zod_1.z.object({
    Lieferant: zod_1.z.object({
        LiefID: zod_1.z.number(),
    }),
});
//# sourceMappingURL=lieferanten.js.map