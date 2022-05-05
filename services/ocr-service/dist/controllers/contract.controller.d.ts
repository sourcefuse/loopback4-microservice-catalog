import { Getter } from '@loopback/context';
import { Filter } from '@loopback/repository';
import { IRequest } from '../../../../packages/fetch-client/dist';
import { Contracts, HocrResults } from '../models';
import { ContractRepository, HocrResultRepository } from '../repositories';
export declare class ContractController {
    private readonly requestProvider;
    contractRepository: ContractRepository;
    hocrResultRepository: HocrResultRepository;
    constructor(requestProvider: Getter<IRequest>, contractRepository: ContractRepository, hocrResultRepository: HocrResultRepository);
    getContractHOCR(contractName: string): Promise<object>;
    convertContractImg(contractName: string): Promise<object>;
    convertContractOcr(contractName: string): Promise<object>;
    getAllHOCRByContractName(contractName: string): Promise<HocrResults[]>;
    getAllContracts(filter?: Filter<Contracts>): Promise<Contracts[]>;
}
