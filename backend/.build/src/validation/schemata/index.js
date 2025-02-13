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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// schemata/index.ts
__exportStar(require("./lieferanten"), exports);
__exportStar(require("./bestellung"), exports);
__exportStar(require("./matLief"), exports);
__exportStar(require("./handlerlieferant"), exports);
__exportStar(require("./inventar"), exports);
__exportStar(require("./wareneingang"), exports);
__exportStar(require("./bestellID"), exports);
__exportStar(require("./buchung"), exports);
__exportStar(require("./invkorrWE"), exports);
__exportStar(require("./getInvKorr"), exports);
//# sourceMappingURL=index.js.map