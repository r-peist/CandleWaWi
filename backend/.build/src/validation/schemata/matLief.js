"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matLiefSchema = void 0;
const zod_1 = require("zod");
exports.matLiefSchema = zod_1.z.object({
    MatLiefs: zod_1.z.array(zod_1.z.object({
        MatLiefID: zod_1.z.number(),
        MatID: zod_1.z.number(),
        LiefID: zod_1.z.number(),
        Link: zod_1.z.string().url(), // Optional: URL-Validierung, falls gewünscht
        MaterialName: zod_1.z.string(),
        LieferantName: zod_1.z.string(),
    }))
});
//# sourceMappingURL=matLief.js.map