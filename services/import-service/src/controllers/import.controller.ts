import {inject} from '@loopback/core';
import {get, param, Response, RestBindings} from '@loopback/rest';
import {AWSS3Bindings} from 'loopback4-s3';
import {ExcelService} from '../services/excel.service';
import {MessageData} from '../types';
const basePath = '/import';
export class ImportController {
  constructor(
    @inject('services.ExcelService') private excelService: ExcelService,
    @inject('importService.sendMessage.provider')
    private sendMessageFn: (data: MessageData[][]) => Promise<void>,
  ) {}
  //Need to change the request body (depends on the type of config)
  @get(`${basePath}/{fileKey}`)
  async downloadMessageFileByFileKey(
    @param.path.string('fileKey') fileKey: string,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AWSS3Bindings.AwsS3Provider) s3: AWS.S3,
  ) {
    const LevelWiseBatches = await this.excelService.getData(fileKey, {});
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.sendMessageFn(LevelWiseBatches);
  }
}
