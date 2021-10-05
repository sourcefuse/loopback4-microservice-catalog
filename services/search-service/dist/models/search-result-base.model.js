"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResultBase = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let SearchResultBase = class SearchResultBase extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], SearchResultBase.prototype, "source", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], SearchResultBase.prototype, "rank", void 0);
SearchResultBase = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], SearchResultBase);
exports.SearchResultBase = SearchResultBase;
//# sourceMappingURL=search-result-base.model.js.map