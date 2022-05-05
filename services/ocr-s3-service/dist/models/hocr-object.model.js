"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HocrObject = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const core_1 = require("@sourceloop/core");
let HocrObject = class HocrObject extends core_1.BaseEntity {
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
], HocrObject.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
        name: 'contract_name',
    }),
    tslib_1.__metadata("design:type", String)
], HocrObject.prototype, "contractName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
        name: 'type',
    }),
    tslib_1.__metadata("design:type", String)
], HocrObject.prototype, "type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
        name: 'page_no',
    }),
    tslib_1.__metadata("design:type", Number)
], HocrObject.prototype, "pageNo", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        name: 'hocr_data',
    }),
    tslib_1.__metadata("design:type", String)
], HocrObject.prototype, "hocrData", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        name: 'img_data',
    }),
    tslib_1.__metadata("design:type", String)
], HocrObject.prototype, "imgData", void 0);
HocrObject = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'hocr_results',
        settings: {
            strict: false,
        },
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], HocrObject);
exports.HocrObject = HocrObject;
//# sourceMappingURL=hocr-object.model.js.map