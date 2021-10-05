"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResult = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let SearchResult = class SearchResult extends repository_1.Model {
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
], SearchResult.prototype, "name", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], SearchResult.prototype, "description", void 0);
SearchResult = tslib_1.__decorate([
    repository_1.model(),
    tslib_1.__metadata("design:paramtypes", [Object])
], SearchResult);
exports.SearchResult = SearchResult;
//# sourceMappingURL=search-result.model.js.map