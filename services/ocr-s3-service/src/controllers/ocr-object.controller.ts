import {
  inject
} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import {
  get,
  param,
  response
} from '@loopback/rest';
import {
  v4 as uuid
} from 'uuid';
import {
  HocrObjectRepository
} from '../repositories';
import { S3HandlerService } from '../services';

export class OcrObjectController {
  constructor(
    @repository(HocrObjectRepository) public hocrObjectRepository: HocrObjectRepository,
    @inject('services.S3HandlerService') public s3Handler: S3HandlerService,
  ) { }

  async asyncForEach<T>(array: Array<T>, callback: (item: T, index: number) => Promise<void>) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index);
    }
  }

  @get('/get-contract-hocr/{contract_name}')
  @response(200, {
    description: 'User model instance'
  })

  async getHocrFiles(
    @param.path.string('contract_name') contract_name: string
  ): Promise<any> {
    let dd: any = {
      contract_name: contract_name,
      type: 'HOCR',
      created_by: uuid(),
      modified_by: uuid()
    }
    const s3ObjectList = await this.s3Handler.listObjects(process.env.BUCKET_NAME, process.env.BUCKET_PREFIX);

    await this.asyncForEach(s3ObjectList!, async (value: any) => {
      if (value.Key) {
        console.log(value.Key)
        const x = value.Key.split('/');
        dd.page_no = x.pop().split('.').slice(0, 1).join('');
        console.log(dd.page_no);
        const data = await this.s3Handler.getObject(process.env.BUCKET_NAME, value.Key);
        const hocrContent: string = await this.s3Handler.streamToString(data);
        dd.hocr_data = hocrContent;
        await this.hocrObjectRepository.create(dd)
      }
    })

    return {
      status: 200,
      message: 'SUCCESS'
    }
  }


  @get('/contract-images/{contract_name}')
  @response(200, {
    description: 'User model instance'
  })

  async getImgFiles(
    @param.path.string('contract_name') contract_name: string
  ): Promise<any> {
    const s3ObjectList = await this.s3Handler.listObjects(process.env.BUCKET_NAME, `contract-images/${contract_name}/images`);

    await this.asyncForEach(s3ObjectList!, async (value) => {
      const data = await this.s3Handler.getObject(process.env.BUCKET_NAME, value.Key);
    })
  }
}