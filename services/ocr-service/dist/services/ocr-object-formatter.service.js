"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrObjectFormatterService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
let OcrObjectFormatterService = class OcrObjectFormatterService {
    constructor() { }
    async format(res) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        const resp = res;
        const clauseTypeData = Object.keys(resp)[0];
        const formattedObject = {
            contractName: resp[clauseTypeData].contractFileName,
            clauseType: (_b = (_a = resp[clauseTypeData]) === null || _a === void 0 ? void 0 : _a.extractedData) === null || _b === void 0 ? void 0 : _b.column,
            pageNumber: (_e = (_d = (_c = resp[clauseTypeData]) === null || _c === void 0 ? void 0 : _c.extractedData) === null || _d === void 0 ? void 0 : _d.columnData) === null || _e === void 0 ? void 0 : _e.pageNum,
            text: (_h = (_g = (_f = resp[clauseTypeData]) === null || _f === void 0 ? void 0 : _f.extractedData) === null || _g === void 0 ? void 0 : _g.columnData) === null || _h === void 0 ? void 0 : _h.value,
            supportedText: (_l = (_k = (_j = resp[clauseTypeData]) === null || _j === void 0 ? void 0 : _j.extractedData) === null || _k === void 0 ? void 0 : _k.columnData) === null || _l === void 0 ? void 0 : _l.supportedValue,
            coordinates: ((_p = (_o = (_m = resp[clauseTypeData]) === null || _m === void 0 ? void 0 : _m.extractedData) === null || _o === void 0 ? void 0 : _o.columnData) === null || _p === void 0 ? void 0 : _p.coordinates) ? JSON.stringify((_s = (_r = (_q = resp[clauseTypeData]) === null || _q === void 0 ? void 0 : _q.extractedData) === null || _r === void 0 ? void 0 : _r.columnData) === null || _s === void 0 ? void 0 : _s.coordinates) : null,
            confidenceLevel: (_v = (_u = (_t = resp[clauseTypeData]) === null || _t === void 0 ? void 0 : _t.extractedData) === null || _u === void 0 ? void 0 : _u.columnData) === null || _v === void 0 ? void 0 : _v.confidenceScore
        };
        return formattedObject;
    }
};
OcrObjectFormatterService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], OcrObjectFormatterService);
exports.OcrObjectFormatterService = OcrObjectFormatterService;
//# sourceMappingURL=ocr-object-formatter.service.js.map