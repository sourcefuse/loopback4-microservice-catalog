import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
import {HocrObjectRepository} from '../repositories';
import {IteratorService, S3HandlerService} from '../services';

export class OcrObjectController {
  constructor(
    @repository(HocrObjectRepository)
    public hocrObjectRepository: HocrObjectRepository,
    @inject('services.S3HandlerService') public s3Handler: S3HandlerService,
    @inject('services.IteratorService') public iteratorService: IteratorService,
  ) {}

  @get('/get-contract-hocr/{contract_name}')
  @response(200, {
    description: 'User model instance',
  })
  async getHocrFiles(
    @param.path.string('contract_name') contractName: string,
  ): Promise<object> {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const contractData: any = {
      contractName: contractName,
      type: 'HOCR',
    };
    const s3ObjectList = await this.s3Handler.listObjects(
      process.env.BUCKET,
      process.env.BUCKET_PREFIX,
    );

    await this.iteratorService.asyncForEach(
      s3ObjectList!,
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      async (value: any) => {
        if (value.Key) {
          const splitValue = value.Key.split('/');
          contractData.page_no = splitValue
            .pop()
            .split('.')
            .slice(0, 1)
            .join('');
          const data = await this.s3Handler.getObject(
            process.env.BUCKET,
            value.Key,
          );
          const hocrContent: string = await this.s3Handler.streamToString(data);
          contractData.hocr_data = hocrContent;
          await this.hocrObjectRepository.create(contractData);
        }
      },
    );

    return {
      status: 200,
      message: 'SUCCESS',
    };
  }

  @get('/contract-images/{contract_name}')
  @response(200, {
    description: 'User model instance',
  })
  async getImgFiles(
    @param.path.string('contract_name') contractName: string,
  ): Promise<object> {
    const s3ObjectList = await this.s3Handler.listObjects(
      process.env.BUCKET,
      process.env.BUCKET_PREFIX,
    );

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    const contractData: any = {
      contractName: contractName,
      type: 'IMG',
    };

    await this.iteratorService.asyncForEach(s3ObjectList!, async value => {
      const data = await this.s3Handler.getObject(
        process.env.BUCKET,
        value.Key,
      );

      const hocrContent: string = await this.s3Handler.streamToString(data);
      contractData.hocr_data = hocrContent;
      await this.hocrObjectRepository.create(contractData);
    });

    return {
      status: 200,
      message: 'SUCCESS',
    };
  }
}
