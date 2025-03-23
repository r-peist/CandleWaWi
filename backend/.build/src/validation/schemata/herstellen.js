"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.herstellenSchema = void 0;
const zod_1 = require("zod");
exports.herstellenSchema = zod_1.z.object({
    Rezept: zod_1.z.object({
        Name: zod_1.z.union([zod_1.z.literal("Kerze"), zod_1.z.literal("SprayDiff"), zod_1.z.literal("ZP")], {
            errorMap: () => ({ message: "Name muss entweder 'Kerze', 'SprayDiff' oder 'ZP' sein" })
        }),
        RezeptID: zod_1.z.number().positive({ message: "RezeptID muss eine positive Zahl sein" }),
        BehaelterID: zod_1.z.number().optional(),
        DeckelID: zod_1.z.number().optional(),
        MatID: zod_1.z.number().optional(),
        Menge: zod_1.z.number().optional(),
        Materialien: zod_1.z.array(zod_1.z.object({
            MatID: zod_1.z.number(),
            Menge: zod_1.z.number(),
        })).optional(),
    })
});
//# sourceMappingURL=herstellen.js.map