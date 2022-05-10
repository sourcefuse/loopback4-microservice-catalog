import {
  inject
} from '@loopback/context';
import {
  repository
} from '@loopback/repository';
import {
  param,
  get,
  response,
  patch,
  requestBody,
  getModelSchemaRef,
  del,
  put
} from '@loopback/rest';
import { RequestServiceBindings } from '../keys';
import {
  OcrResults
} from '../models';
import { FetchClientProvider } from '../providers';
import {
  ContractRepository,
  OcrResultRepository
} from '../repositories';

export class OcrController {
  constructor(
    @repository(OcrResultRepository) public ocrResultRepository: OcrResultRepository,
    @repository(ContractRepository) public contractRepository: ContractRepository,
    @inject.getter(RequestServiceBindings.FetchProvider) private readonly requestProvider: FetchClientProvider,
  ) {
  }

  @get('/document-type/{id}')
  @response(200, {
    description: 'Get contract document type'
  })
  async getContractDocumentType(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/document-type?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/termination-clause/{id}')
  @response(200, {
    description: 'Get contract termination clause'
  })
  async getContractTerminationClause(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/termination-clause?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/ipr-ownership-clause/{id}')
  @response(200, {
    description: 'Get contract ipr ownership clause'
  })
  async getContractIprOwnershipClause(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/ipr-ownership-clause?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/warranty-clause/{id}')
  @response(200, {
    description: 'Get contract warranty clause'
  })
  async getContractWarrantyClause(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/warranty-clause?contract_name=${contract.contractName}`);

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/third-party-beneficiary/{id}')
  @response(200, {
    description: 'Get contract third party beneficiary'
  })
  async getContractThirdPartyBeneficiary(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/third-party-beneficiary?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/governing-law/{id}')
  @response(200, {
    description: 'Get contract governing law'
  })
  async getContractGoverningLaw(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/governing-law?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/validity-terms/{id}')
  @response(200, {
    description: 'Get contract validity terms'
  })
  async getContractValidityTerms(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/validity-terms?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }

  @get('/liquidity-damages/{id}')
  @response(200, {
    description: 'Get contract liquidity damages'
  })
  async getContractLiquidityDamages(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/liquidity-damages?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/limited-liability/{id}')
  @response(200, {
    description: 'Get contract limited liability'
  })
  async getContractLimitedLiability(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/limited-liability?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/legal-id/{id}')
  @response(200, {
    description: 'Get contract legal id'
  })
  async getContractLegalId(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/legal_id?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/signatory-details/{id}')
  @response(200, {
    description: 'Get contract signatory details'
  })
  async getContractSignatoryDetails(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/signatory_details?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/vendor/{id}')
  @response(200, {
    description: 'Get contract vendor info'
  })
  async getContractVendor(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/vendor?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/payment-terms/{id}')
  @response(200, {
    description: 'Get contract payment terms'
  })
  async getContractPaymentTerms(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/payment_terms?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/force-majeure/{id}')
  @response(200, {
    description: 'Get contract force majeure'
  })
  async getContractForceMajeure(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/force-majeure?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/indemnity-clause/{id}')
  @response(200, {
    description: 'Get contract indemnity clause'
  })
  async getContractIndemnityClause(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/indemnity-clause?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }

  @get('/auto-renewal/{id}')
  @response(200, {
    description: 'Get contract auto renewal'
  })
  async getContractAutoRenewal(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/auto-renewal?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }

  @get('/currency/{id}')
  @response(200, {
    description: 'Get contract currency'
  })
  async getContractCurrency(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/currency?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }

  @get('/public-announcement/{id}')
  @response(200, {
    description: 'Get contract public announcement'
  })
  async getContractPublicAnnouncement(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/public-announcement?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/assignment/{id}')
  @response(200, {
    description: 'Get contract assignment'
  })
  async getContractAssignment(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/assignment?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }

  @get('/support/{id}')
  @response(200, {
    description: 'Get contract support'
  })
  async getContractSupport(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/support?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }

  @get('/contract-amount/{id}')
  @response(200, {
    description: 'Get contract contract_amount'
  })
  async getContractContractAmount(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/contract-amount?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }

  @get('/sla-clause/{id}')
  @response(200, {
    description: 'Get contract sla clause'
  })
  async getContractSlaClause(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/sla-clause?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }

  @get('/sla-dashboard/{id}')
  @response(200, {
    description: 'Get contract sla dashboard'
  })
  async getContractSlaDashboard(
    @param.path.string('id') id: string,
  ): Promise<object> {

    const contract = await this.contractRepository.findById(id);
    await this.requestProvider.post(`/contract-parser/sla-dashboard?contract_name=${contract.contractName}`)

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/clauses/{contract_id}')
  @response(200, {
    description: 'Get all contract clauses'
  })
  async getContractClauses(
    @param.path.string('contract_id') contractId: string,
  ): Promise<OcrResults[]> {
    return this.ocrResultRepository.find({
      where: {
        contractId: contractId
      }
    });
  }

  @patch('/clauses')
  @response(200, {
    description: 'Clauses PATCH success count'
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(OcrResults, {
              title: 'Clauses'
            }),
          }
        },
      },
    })
    clauses: [Pick<OcrResults, 'id' | 'text' | 'confidenceLevel'>]
  ): Promise<any> {
    const result = await Promise.all(clauses.map((item) => this.ocrResultRepository.updateById(item.id, item)));
    return result;
  }


  @patch('/clauses/{id}')
  @response(204, {
    description: 'Clauses PATCH success',
  })
  async updateClauseById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OcrResults, { partial: true }),
        },
      },
    })
    clause: Omit<OcrResults, 'id'>,
  ): Promise<void> {
    return this.ocrResultRepository.updateById(id, clause);
  }

  @put('/clauses/{id}')
  @response(204, {
    description: 'Clauses PUT success',
  })
  async replaceClauseById(
    @param.path.string('id') id: string,
    @requestBody() clause: OcrResults,
  ): Promise<void> {
    return this.ocrResultRepository.replaceById(id, clause);
  }

  @del('/clauses/{id}')
  @response(204, {
    description: 'Clauses DELETE success',
  })
  async deleteClauseById(
    @param.path.string('id') id: string,
  ): Promise<void> {
    return this.ocrResultRepository.deleteById(id);
  }

}