"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerlieferantSchema = void 0;
const zod_1 = require("zod");
exports.handlerlieferantSchema = zod_1.z.object({
    Lieferanten: zod_1.z.array(zod_1.z.object({
        LiefID: zod_1.z.number(),
        Name: zod_1.z.string(),
    })),
});
//# sourceMappingURL=handlerlieferant.js.map