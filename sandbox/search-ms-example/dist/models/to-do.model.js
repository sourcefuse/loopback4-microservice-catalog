"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToDo = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let ToDo = class ToDo extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        id: true,
    }),
    tslib_1.__metadata("design:type", String)
], ToDo.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], ToDo.prototype, "name", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], ToDo.prototype, "description", void 0);
ToDo = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], ToDo);
exports.ToDo = ToDo;
//# sourceMappingURL=to-do.model.js.map