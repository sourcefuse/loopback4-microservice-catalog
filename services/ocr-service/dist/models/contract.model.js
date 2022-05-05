"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contracts = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const core_1 = require("@sourceloop/core");
let Contracts = class Contracts extends core_1.BaseEntity {
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
], Contracts.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
        name: 'contract_name',
    }),
    tslib_1.__metadata("design:type", String)
], Contracts.prototype, "contractName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'boolean',
        default: false,
        name: 'contract_uploaded',
    }),
    tslib_1.__metadata("design:type", Boolean)
], Contracts.prototype, "contractUploaded", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'boolean',
        default: false,
        name: 'image_converted',
    }),
    tslib_1.__metadata("design:type", Boolean)
], Contracts.prototype, "imageConverted", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'boolean',
        default: false,
        name: 'ocr_converted',
    }),
    tslib_1.__metadata("design:type", Boolean)
], Contracts.prototype, "ocrConverted", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'boolean',
        default: false,
        name: 'hocr_converted',
    }),
    tslib_1.__metadata("design:type", Boolean)
], Contracts.prototype, "hocrConverted", void 0);
Contracts = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'ocr_contracts',
        settings: {
            strict: false,
        },
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Contracts);
exports.Contracts = Contracts;
//# sourceMappingURL=contract.model.js.map