"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrHooksController = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const services_1 = require("../services");
let OcrHooksController = class OcrHooksController {
    constructor(ocrResultRepository, contractRepository, ocrObjectFormatter) {
        this.ocrResultRepository = ocrResultRepository;
        this.contractRepository = contractRepository;
        this.ocrObjectFormatter = ocrObjectFormatter;
    }
    async uploadContractFile(contract) {
        contract.contractUploaded = true;
        return this.contractRepository.create(contract);
    }
    async convertContractImages(contract
    // eslint-disable-next-line
    ) {
        contract.imageConverted = true;
        return this.contractRepository.updateById(contract.id, contract);
    }
    async convertContractOcr(contract
    // eslint-disable-next-line
    ) {
        contract.ocrConverted = true;
        return this.contractRepository.updateById(contract.id, contract);
    }
    async convertContractHocr(contract
    // eslint-disable-next-line
    ) {
        contract.hocrConverted = true;
        return this.contractRepository.updateById(contract.id, contract);
    }
    async getContractDocumentType(req) {
        // eslint-disable-next-line
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractTerminationClause(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractIprOwnershipClause(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractWarrantyClause(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractThirdPartyBeneficiary(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractGoverningLaw(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractValidityTerms(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractLiquidityDamages(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractLimitedLiability(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractLegalId(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractSignatoryDetails(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractVendor(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractPaymentTerms(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractForceMajeure(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractIndemnityClause(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractAutoRenewal(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractCurrency(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractPublicAnnouncement(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractAssignment(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractSupport(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractContractAmount(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractSlaClause(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
    async getContractSlaDashboard(req) {
        const ocrObject = await this.ocrObjectFormatter.format(req);
        return this.ocrResultRepository.create(ocrObject);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/contract-upload'),
    (0, rest_1.response)(200, {
        description: 'Upload contract document'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Contracts]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "uploadContractFile", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/img-convert'),
    (0, rest_1.response)(200, {
        description: 'Convert contract document to image'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Contracts
        // eslint-disable-next-line
    ]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "convertContractImages", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/ocr-convert'),
    (0, rest_1.response)(200, {
        description: 'Convert contract ocr'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Contracts
        // eslint-disable-next-line
    ]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "convertContractOcr", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/hocr-convert'),
    (0, rest_1.response)(200, {
        description: 'Convert contract hocr'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Contracts
        // eslint-disable-next-line
    ]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "convertContractHocr", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/document-type'),
    (0, rest_1.response)(200, {
        description: 'Get contract document type'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractDocumentType", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/termination-clause'),
    (0, rest_1.response)(200, {
        description: 'Get contract termination clause'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractTerminationClause", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/ipr-ownership-clause'),
    (0, rest_1.response)(200, {
        description: 'Get contract ipr ownership clause'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractIprOwnershipClause", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/warranty-clause'),
    (0, rest_1.response)(200, {
        description: 'Get contract warranty clause'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractWarrantyClause", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/third-party-beneficiary'),
    (0, rest_1.response)(200, {
        description: 'Get contract third party beneficiary'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractThirdPartyBeneficiary", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/governing-law'),
    (0, rest_1.response)(200, {
        description: 'Get contract governing law'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractGoverningLaw", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/validity-terms'),
    (0, rest_1.response)(200, {
        description: 'Get contract validity terms'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractValidityTerms", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/liquidity-damages'),
    (0, rest_1.response)(200, {
        description: 'Get contract liquidity damages'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractLiquidityDamages", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/limited-liability'),
    (0, rest_1.response)(200, {
        description: 'Get contract limited liability'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractLimitedLiability", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/legal-id'),
    (0, rest_1.response)(200, {
        description: 'Get contract legal id'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractLegalId", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/signatory-details'),
    (0, rest_1.response)(200, {
        description: 'Get contract signatory details'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractSignatoryDetails", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/vendor'),
    (0, rest_1.response)(200, {
        description: 'Get contract vendor info'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractVendor", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/payment-terms'),
    (0, rest_1.response)(200, {
        description: 'Get contract payment terms'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractPaymentTerms", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/force-majeure'),
    (0, rest_1.response)(200, {
        description: 'Get contract force majeure'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractForceMajeure", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/indemnity-clause'),
    (0, rest_1.response)(200, {
        description: 'Get contract indemnity clause'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractIndemnityClause", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/auto-renewal'),
    (0, rest_1.response)(200, {
        description: 'Get contract auto renewal'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractAutoRenewal", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/currency'),
    (0, rest_1.response)(200, {
        description: 'Get contract currency'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractCurrency", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/public-announcement'),
    (0, rest_1.response)(200, {
        description: 'Get contract public announcement'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractPublicAnnouncement", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/assignment'),
    (0, rest_1.response)(200, {
        description: 'Get contract assignment'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractAssignment", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/support'),
    (0, rest_1.response)(200, {
        description: 'Get contract support'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractSupport", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/contract-amount'),
    (0, rest_1.response)(200, {
        description: 'Get contract contract_amount'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractContractAmount", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/sla-clause'),
    (0, rest_1.response)(200, {
        description: 'Get contract sla clause'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractSlaClause", null);
tslib_1.__decorate([
    (0, rest_1.post)('/webhook/sla-dashboard'),
    (0, rest_1.response)(200, {
        description: 'Get contract sla dashboard'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrHooksController.prototype, "getContractSlaDashboard", null);
OcrHooksController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.OcrResultRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.ContractRepository)),
    tslib_1.__param(2, (0, context_1.inject)('services.OcrObjectFormatterService')),
    tslib_1.__metadata("design:paramtypes", [repositories_1.OcrResultRepository,
        repositories_1.ContractRepository,
        services_1.OcrObjectFormatterService])
], OcrHooksController);
exports.OcrHooksController = OcrHooksController;
//# sourceMappingURL=ocr-hooks.controller.js.map