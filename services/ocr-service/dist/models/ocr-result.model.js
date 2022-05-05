"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrResults = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const core_1 = require("@sourceloop/core");
let OcrResults = class OcrResults extends core_1.BaseEntity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        id: true,
    }),
    tslib_1.__metadata("design:type", String)
], OcrResults.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
        name: 'contract_name',
    }),
    tslib_1.__metadata("design:type", String)
], OcrResults.prototype, "contractName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        name: 'clause_type',
    }),
    tslib_1.__metadata("design:type", String)
], OcrResults.prototype, "clauseType", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        name: 'page_no',
    }),
    tslib_1.__metadata("design:type", Number)
], OcrResults.prototype, "pageNo", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        name: 'text',
    }),
    tslib_1.__metadata("design:type", String)
], OcrResults.prototype, "text", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        name: 'supported_text',
    }),
    tslib_1.__metadata("design:type", String)
], OcrResults.prototype, "supportedText", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        name: 'coordinates',
    }),
    tslib_1.__metadata("design:type", String)
], OcrResults.prototype, "coordinates", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        name: 'confidence_level',
    }),
    tslib_1.__metadata("design:type", Number)
], OcrResults.prototype, "confidenceLevel", void 0);
OcrResults = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'ocr_results',
        settings: {
            strict: false,
        },
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], OcrResults);
exports.OcrResults = OcrResults;
//# sourceMappingURL=ocr-result.model.js.map