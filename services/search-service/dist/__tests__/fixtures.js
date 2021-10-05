"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestQueryBuilder = exports.TestSearchedCustom = exports.TestSearched = exports.TestSearchModel = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const classes_1 = require("../classes");
const testQueryStmt = (columns, name, where) => `SELECT ${columns} from ${name} where ${where}`;
let TestSearchModel = class TestSearchModel extends repository_1.Entity {
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], TestSearchModel.prototype, "description", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], TestSearchModel.prototype, "name", void 0);
TestSearchModel = tslib_1.__decorate([
    repository_1.model({})
], TestSearchModel);
exports.TestSearchModel = TestSearchModel;
let TestSearched = class TestSearched extends repository_1.Entity {
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], TestSearched.prototype, "description", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], TestSearched.prototype, "name", void 0);
TestSearched = tslib_1.__decorate([
    repository_1.model({})
], TestSearched);
exports.TestSearched = TestSearched;
let TestSearchedCustom = class TestSearchedCustom extends repository_1.Entity {
};
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], TestSearchedCustom.prototype, "about", void 0);
tslib_1.__decorate([
    repository_1.property({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], TestSearchedCustom.prototype, "identifier", void 0);
TestSearchedCustom = tslib_1.__decorate([
    repository_1.model({})
], TestSearchedCustom);
exports.TestSearchedCustom = TestSearchedCustom;
class TestQueryBuilder extends classes_1.SearchQueryBuilder {
    constructor() {
        super(...arguments);
        this.unionString = ' UNION ALL ';
    }
    search(modelName, columns) {
        let columnList;
        let where;
        if (Array.isArray(columns)) {
            columnList = columns.join(', ');
            where = columns.map(c => `${c} = $1`).join(', ');
        }
        else {
            columnList = Object.keys(columns)
                .map(k => `${columns[k]} as ${k}`)
                .join(', ');
            where = Object.keys(columns)
                .map(c => `${c} = $1`)
                .join(', ');
        }
        this.baseQueryList.push(testQueryStmt(columnList, modelName, where));
    }
}
exports.TestQueryBuilder = TestQueryBuilder;
//# sourceMappingURL=fixtures.js.map