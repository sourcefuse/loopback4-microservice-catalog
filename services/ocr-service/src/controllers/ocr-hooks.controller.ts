import {
  inject
} from '@loopback/context';
import {
  repository
} from '@loopback/repository';
import {
  post,
  requestBody,
  response
} from '@loopback/rest';
import {
  Contracts,
  OcrResults
} from '../models';
import {
  OcrResultRepository,
  ContractRepository
} from '../repositories';
import { OcrObjectFormatterService } from '../services';
import {
  OcrClause
} from '../types';


export class OcrHooksController {
  constructor(
    @repository(OcrResultRepository) public ocrResultRepository: OcrResultRepository,
    @repository(ContractRepository) public contractRepository: ContractRepository,
    @inject('services.OcrObjectFormatterService') public ocrObjectFormatter: OcrObjectFormatterService,
  ) { }

  @post('/webhook/contract-upload')
  @response(200, {
    description: 'Upload contract document'
  })
  async uploadContractFile(
    @requestBody() contract: Contracts
  ): Promise<object> {
    contract.contractUploaded = true;
    return this.contractRepository.create(contract);
  }

  @post('/webhook/img-convert')
  @response(200, {
    description: 'Convert contract document to image'
  })
  async convertContractImages(
    @requestBody() contract: Contracts
    // eslint-disable-next-line
  ): Promise<any> {
    contract.imageConverted = true;
    return this.contractRepository.updateById(contract.id, contract);
  }

  @post('/webhook/ocr-convert')
  @response(200, {
    description: 'Convert contract ocr'
  })
  async convertContractOcr(
    @requestBody() contract: Contracts
    // eslint-disable-next-line
  ): Promise<any> {
    contract.ocrConverted = true;
    return this.contractRepository.updateById(contract.id, contract);
  }

  @post('/webhook/hocr-convert')
  @response(200, {
    description: 'Convert contract hocr'
  })
  async convertContractHocr(
    @requestBody() contract: Contracts
    // eslint-disable-next-line
  ): Promise<any> {
    contract.hocrConverted = true;
    return this.contractRepository.updateById(contract.id, contract);
  }


  @post('/webhook/document-type')
  @response(200, {
    description: 'Get contract document type'
  })
  async getContractDocumentType(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/termination-clause')
  @response(200, {
    description: 'Get contract termination clause'
  })
  async getContractTerminationClause(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/ipr-ownership-clause')
  @response(200, {
    description: 'Get contract ipr ownership clause'
  })
  async getContractIprOwnershipClause(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/warranty-clause')
  @response(200, {
    description: 'Get contract warranty clause'
  })
  async getContractWarrantyClause(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/third-party-beneficiary')
  @response(200, {
    description: 'Get contract third party beneficiary'
  })
  async getContractThirdPartyBeneficiary(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/governing-law')
  @response(200, {
    description: 'Get contract governing law'
  })
  async getContractGoverningLaw(
    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/validity-terms')
  @response(200, {
    description: 'Get contract validity terms'
  })
  async getContractValidityTerms(
    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }

  @post('/webhook/liquidity-damages')
  @response(200, {
    description: 'Get contract liquidity damages'
  })
  async getContractLiquidityDamages(
    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/limited-liability')
  @response(200, {
    description: 'Get contract limited liability'
  })
  async getContractLimitedLiability(
    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/legal-id')
  @response(200, {
    description: 'Get contract legal id'
  })
  async getContractLegalId(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/signatory-details')
  @response(200, {
    description: 'Get contract signatory details'
  })
  async getContractSignatoryDetails(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/vendor')
  @response(200, {
    description: 'Get contract vendor info'
  })
  async getContractVendor(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/payment-terms')
  @response(200, {
    description: 'Get contract payment terms'
  })
  async getContractPaymentTerms(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/force-majeure')
  @response(200, {
    description: 'Get contract force majeure'
  })
  async getContractForceMajeure(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/indemnity-clause')
  @response(200, {
    description: 'Get contract indemnity clause'
  })
  async getContractIndemnityClause(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }

  @post('/webhook/auto-renewal')
  @response(200, {
    description: 'Get contract auto renewal'
  })
  async getContractAutoRenewal(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }

  @post('/webhook/currency')
  @response(200, {
    description: 'Get contract currency'
  })
  async getContractCurrency(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }

  @post('/webhook/public-announcement')
  @response(200, {
    description: 'Get contract public announcement'
  })
  async getContractPublicAnnouncement(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }


  @post('/webhook/assignment')
  @response(200, {
    description: 'Get contract assignment'
  })
  async getContractAssignment(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }

  @post('/webhook/support')
  @response(200, {
    description: 'Get contract support'
  })
  async getContractSupport(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }

  @post('/webhook/contract-amount')
  @response(200, {
    description: 'Get contract contract_amount'
  })
  async getContractContractAmount(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }

  @post('/webhook/sla-clause')
  @response(200, {
    description: 'Get contract sla clause'
  })
  async getContractSlaClause(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }

  @post('/webhook/sla-dashboard')
  @response(200, {
    description: 'Get contract sla dashboard'
  })
  async getContractSlaDashboard(

    @requestBody() req: OcrClause
  ): Promise<OcrResults> {
    const ocrObject: any = await this.ocrObjectFormatter.format(req);
    return this.ocrResultRepository.create(ocrObject);
  }
}