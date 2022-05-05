import { HocrObjectRepository } from '../repositories';
import { S3HandlerService } from '../services';
export declare class OcrObjectController {
    hocrObjectRepository: HocrObjectRepository;
    s3Handler: S3HandlerService;
    constructor(hocrObjectRepository: HocrObjectRepository, s3Handler: S3HandlerService);
    asyncForEach<T>(array: Array<T>, callback: (item: T, index: number) => Promise<void>): Promise<void>;
    getHocrFiles(contractName: string): Promise<object>;
    getImgFiles(contractName: string): Promise<object>;
}
