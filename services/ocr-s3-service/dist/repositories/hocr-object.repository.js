"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HocrObjectRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
const types_1 = require("../types");
let HocrObjectRepository = class HocrObjectRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.HocrObject, dataSource);
    }
};
HocrObjectRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(`datasources.${types_1.OcrS3DbSourceName}`)),
    tslib_1.__metadata("design:paramtypes", [repository_1.juggler.DataSource])
], HocrObjectRepository);
exports.HocrObjectRepository = HocrObjectRepository;
//# sourceMappingURL=hocr-object.repository.js.map