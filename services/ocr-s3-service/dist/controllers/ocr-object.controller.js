"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrObjectController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const repositories_1 = require("../repositories");
const services_1 = require("../services");
let OcrObjectController = class OcrObjectController {
    constructor(hocrObjectRepository, s3Handler) {
        this.hocrObjectRepository = hocrObjectRepository;
        this.s3Handler = s3Handler;
    }
    async asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index);
        }
    }
    async getHocrFiles(contractName) {
        const s3ObjectList = await this.s3Handler.listObjects('rakuten-clm-ml-dev', `contract-images/${contractName}/hocr`);
        // eslint-disable-next-line
        await this.asyncForEach(s3ObjectList, async (value) => {
            if (value.Key) {
                const keyValue = value.Key.split('/');
                const pageNo = keyValue.pop().split('.').slice(0, 1).join('');
                const data = await this.s3Handler.getObject('rakuten-clm-ml-dev', value.Key);
                const hocrContent = await this.s3Handler.streamToString(data);
                // eslint-disable-next-line
                const s3ObjectData = {
                    contractName: contractName,
                    type: 'HOCR',
                    pageNo: pageNo,
                    hocrData: hocrContent,
                    imgData: '',
                };
                await this.hocrObjectRepository.create(s3ObjectData);
            }
        });
        return {
            status: 200,
            message: 'SUCCESS',
        };
    }
    async getImgFiles(contractName) {
        const s3ObjectList = await this.s3Handler.listObjects('rakuten-clm-ml-dev', `contract-images/${contractName}/images`);
        await this.asyncForEach(s3ObjectList, async (value) => {
            await this.s3Handler.getObject('rakuten-clm-ml-dev', value.Key);
        });
        return {
            status: 200,
            message: 'SUCCESS',
        };
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/get-contract-hocr/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'User model instance',
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrObjectController.prototype, "getHocrFiles", null);
tslib_1.__decorate([
    (0, rest_1.get)('/contract-images/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'User model instance',
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrObjectController.prototype, "getImgFiles", null);
OcrObjectController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.HocrObjectRepository)),
    tslib_1.__param(1, (0, core_1.inject)('services.S3HandlerService')),
    tslib_1.__metadata("design:paramtypes", [repositories_1.HocrObjectRepository,
        services_1.S3HandlerService])
], OcrObjectController);
exports.OcrObjectController = OcrObjectController;
//# sourceMappingURL=ocr-object.controller.js.map