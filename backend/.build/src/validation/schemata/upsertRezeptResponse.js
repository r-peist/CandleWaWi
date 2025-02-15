"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedSchema = void 0;
const zod_1 = require("zod");
exports.updatedSchema = zod_1.z.object({
    Updated: zod_1.z.object({
        Rezept: zod_1.z.enum(["Kerze", "SprayDiff", "ZP", "Fehler"], {
            errorMap: () => ({ message: "Rezept muss entweder 'Kerze', 'SprayDiff', 'ZP' oder 'Fehler' sein" })
        }),
        ID: zod_1.z.number().nonnegative({ message: "ID muss 0 oder eine positive Zahl sein" }),
        message: zod_1.z.string().min(1, { message: "Message darf nicht leer sein" })
    })
});
//# sourceMappingURL=upsertRezeptResponse.js.map