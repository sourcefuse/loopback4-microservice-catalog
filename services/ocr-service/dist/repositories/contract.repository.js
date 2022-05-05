"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const core_2 = require("@sourceloop/core");
const models_1 = require("../models");
const types_1 = require("../types");
let ContractRepository = class ContractRepository extends core_2.DefaultSoftCrudRepository {
    constructor(dataSource) {
        super(models_1.Contracts, dataSource);
    }
};
ContractRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(`datasources.${types_1.OcrDbSourceName}`)),
    tslib_1.__metadata("design:paramtypes", [repository_1.juggler.DataSource])
], ContractRepository);
exports.ContractRepository = ContractRepository;
//# sourceMappingURL=contract.repository.js.map