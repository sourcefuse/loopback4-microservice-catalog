import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param, response} from '@loopback/rest';
import {HocrObjectRepository} from '../repositories';
import {S3HandlerService} from '../services';

export class OcrObjectController {
  constructor(
    @repository(HocrObjectRepository)
    public hocrObjectRepository: HocrObjectRepository,
    @inject('services.S3HandlerService') public s3Handler: S3HandlerService,
  ) {}

  async asyncForEach<T>(
    array: Array<T>,
    callback: (item: T, index: number) => Promise<void>,
  ) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index);
    }
  }

  @get('/get-contract-hocr/{contract_name}')
  @response(200, {
    description: 'User model instance',
  })
  async getHocrFiles(
    @param.path.string('contract_name') contractName: string,
  ): Promise<object> {
    const s3ObjectList = await this.s3Handler.listObjects(
      'rakuten-clm-ml-dev',
      `contract-images/${contractName}/hocr`,
    );
    // eslint-disable-next-line
    await this.asyncForEach(s3ObjectList!, async (value: any) => {
      if (value.Key) {
        const keyValue = value.Key.split('/');
        const pageNo = keyValue.pop().split('.').slice(0, 1).join('');
        const data = await this.s3Handler.getObject(
          'rakuten-clm-ml-dev',
          value.Key,
        );
        const hocrContent: string = await this.s3Handler.streamToString(data);
        // eslint-disable-next-line
        const s3ObjectData: any = {
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

  @get('/contract-images/{contract_name}')
  @response(200, {
    description: 'User model instance',
  })
  async getImgFiles(
    @param.path.string('contract_name') contractName: string,
  ): Promise<object> {
    const s3ObjectList = await this.s3Handler.listObjects(
      'rakuten-clm-ml-dev',
      `contract-images/${contractName}/images`,
    );

    await this.asyncForEach(s3ObjectList!, async value => {
      await this.s3Handler.getObject('rakuten-clm-ml-dev', value.Key);
    });

    return {
      status: 200,
      message: 'SUCCESS',
    };
  }
}
