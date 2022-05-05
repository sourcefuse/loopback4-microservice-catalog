"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractController = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
//import multiparty from 'multiparty';
const dist_1 = require("../../../../packages/fetch-client/dist");
// import FormData from 'form-data';
// import * as fs from 'fs';
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let ContractController = class ContractController {
    constructor(requestProvider, contractRepository, hocrResultRepository) {
        this.requestProvider = requestProvider;
        this.contractRepository = contractRepository;
        this.hocrResultRepository = hocrResultRepository;
    }
    async getContractHOCR(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/hocr-converter?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async convertContractImg(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/img-converter?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async convertContractOcr(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/ocr-converter?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getAllHOCRByContractName(contractName) {
        const hocr = await this.hocrResultRepository.find({
            where: {
                contractName: contractName
            }
        });
        return hocr;
    }
    async getAllContracts(filter) {
        return this.contractRepository.find(filter);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/hocr-convert/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'hcr file converter'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ContractController.prototype, "getContractHOCR", null);
tslib_1.__decorate([
    (0, rest_1.get)('/img-convert/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'image file converter'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ContractController.prototype, "convertContractImg", null);
tslib_1.__decorate([
    (0, rest_1.get)('/ocr-convert/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'ocr file converter'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ContractController.prototype, "convertContractOcr", null);
tslib_1.__decorate([
    (0, rest_1.get)('/hocr-file/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'hcr file converter'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ContractController.prototype, "getAllHOCRByContractName", null);
tslib_1.__decorate([
    (0, rest_1.get)('/contracts'),
    (0, rest_1.response)(200, {
        description: 'all contract files'
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Contracts)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ContractController.prototype, "getAllContracts", null);
ContractController = tslib_1.__decorate([
    tslib_1.__param(0, context_1.inject.getter(dist_1.RequestBindings.FetchProvider)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.ContractRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.HocrResultRepository)),
    tslib_1.__metadata("design:paramtypes", [Function, repositories_1.ContractRepository,
        repositories_1.HocrResultRepository])
], ContractController);
exports.ContractController = ContractController;
//# sourceMappingURL=contract.controller.js.map