"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrController = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const dist_1 = require("../../../../packages/fetch-client/dist");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let OcrController = class OcrController {
    constructor(ocrResultRepository, requestProvider) {
        this.ocrResultRepository = ocrResultRepository;
        this.requestProvider = requestProvider;
    }
    async getContractDocumentType(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/document-type?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractTerminationClause(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/termination-clause?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractIprOwnershipClause(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/ipr-ownership-clause?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractWarrantyClause(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/warranty-clause?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractThirdPartyBeneficiary(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/third-party-beneficiary?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractGoverningLaw(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/governing-law?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractValidityTerms(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/validity-terms?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractLiquidityDamages(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/liquidity-damages?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractLimitedLiability(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/limited-liability?contract_name=${contractName}`, {
            method: 'POST'
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractLegalId(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/legal_id?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractSignatoryDetails(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/signatory_details?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractVendor(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/vendor?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractPaymentTerms(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/payment_terms?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractForceMajeure(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/force-majeure?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractIndemnityClause(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/indemnity-clause?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractAutoRenewal(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/auto-renewal?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractCurrency(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/currency?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractPublicAnnouncement(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/public-announcement?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractAssignment(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/assignment?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractSupport(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/support?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractContractAmount(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/contract-amount?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractSlaClause(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/sla-clause?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractSlaDashboard(contractName) {
        const provider = await this.requestProvider();
        await provider.send(`/contract-parser/sla-dashboard?contract_name=${contractName}`, {
            method: 'POST',
        });
        return {
            status: 200,
            message: 'SUCCESS'
        };
    }
    async getContractClauses(contractName) {
        return this.ocrResultRepository.find({
            where: {
                contractName: contractName
            }
        });
    }
    async updateAll(clauses
    // eslint-disable-next-line
    ) {
        const result = await Promise.all(clauses.map((item) => this.ocrResultRepository.updateById(item.id, item)));
        return result;
    }
    async updateClauseById(id, clause) {
        return this.ocrResultRepository.updateById(id, clause);
    }
    async replaceClauseById(id, clause) {
        return this.ocrResultRepository.replaceById(id, clause);
    }
    async deleteClauseById(id) {
        return this.ocrResultRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/document-type/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract document type'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractDocumentType", null);
tslib_1.__decorate([
    (0, rest_1.get)('/termination-clause/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract termination clause'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractTerminationClause", null);
tslib_1.__decorate([
    (0, rest_1.get)('/ipr-ownership-clause/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract ipr ownership clause'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractIprOwnershipClause", null);
tslib_1.__decorate([
    (0, rest_1.get)('/warranty-clause/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract warranty clause'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractWarrantyClause", null);
tslib_1.__decorate([
    (0, rest_1.get)('/third-party-beneficiary/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract third party beneficiary'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractThirdPartyBeneficiary", null);
tslib_1.__decorate([
    (0, rest_1.get)('/governing-law/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract governing law'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractGoverningLaw", null);
tslib_1.__decorate([
    (0, rest_1.get)('/validity-terms/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract validity terms'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractValidityTerms", null);
tslib_1.__decorate([
    (0, rest_1.get)('/liquidity-damages/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract liquidity damages'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractLiquidityDamages", null);
tslib_1.__decorate([
    (0, rest_1.get)('/limited-liability/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract limited liability'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractLimitedLiability", null);
tslib_1.__decorate([
    (0, rest_1.get)('/legal-id/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract legal id'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractLegalId", null);
tslib_1.__decorate([
    (0, rest_1.get)('/signatory-details/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract signatory details'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractSignatoryDetails", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vendor/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract vendor info'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractVendor", null);
tslib_1.__decorate([
    (0, rest_1.get)('/payment-terms/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract payment terms'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractPaymentTerms", null);
tslib_1.__decorate([
    (0, rest_1.get)('/force-majeure/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract force majeure'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractForceMajeure", null);
tslib_1.__decorate([
    (0, rest_1.get)('/indemnity-clause/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract indemnity clause'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractIndemnityClause", null);
tslib_1.__decorate([
    (0, rest_1.get)('/auto-renewal/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract auto renewal'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractAutoRenewal", null);
tslib_1.__decorate([
    (0, rest_1.get)('/currency/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract currency'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractCurrency", null);
tslib_1.__decorate([
    (0, rest_1.get)('/public-announcement/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract public announcement'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractPublicAnnouncement", null);
tslib_1.__decorate([
    (0, rest_1.get)('/assignment/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract assignment'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractAssignment", null);
tslib_1.__decorate([
    (0, rest_1.get)('/support/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract support'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractSupport", null);
tslib_1.__decorate([
    (0, rest_1.get)('/contract-amount/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract contract_amount'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractContractAmount", null);
tslib_1.__decorate([
    (0, rest_1.get)('/sla-clause/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract sla clause'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractSlaClause", null);
tslib_1.__decorate([
    (0, rest_1.get)('/sla-dashboard/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get contract sla dashboard'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractSlaDashboard", null);
tslib_1.__decorate([
    (0, rest_1.get)('/clauses/{contract_name}'),
    (0, rest_1.response)(200, {
        description: 'Get all contract clauses'
    }),
    tslib_1.__param(0, rest_1.param.path.string('contract_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "getContractClauses", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/clauses'),
    (0, rest_1.response)(200, {
        description: 'Clauses PATCH success count'
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            // eslint-disable-next-line
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.OcrResults, {
                        title: 'Clauses'
                    }),
                }
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "updateAll", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/clauses/{id}'),
    (0, rest_1.response)(204, {
        description: 'Clauses PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            // eslint-disable-next-line
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.OcrResults, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "updateClauseById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/clauses/{id}'),
    (0, rest_1.response)(204, {
        description: 'Clauses PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.OcrResults]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "replaceClauseById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/clauses/{id}'),
    (0, rest_1.response)(204, {
        description: 'Clauses DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OcrController.prototype, "deleteClauseById", null);
OcrController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.OcrResultRepository)),
    tslib_1.__param(1, context_1.inject.getter(dist_1.RequestBindings.FetchProvider)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.OcrResultRepository, Function])
], OcrController);
exports.OcrController = OcrController;
//# sourceMappingURL=ocr.controller.js.map