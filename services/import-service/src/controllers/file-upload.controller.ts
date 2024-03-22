import {inject, service} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {
  HttpErrors,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import * as AWS from 'aws-sdk';
import {AWSS3Bindings} from 'loopback4-s3';
import {FileUploadBindings} from '../keys';
import {FileHelperService} from '../services/file-helper.service';
import {IUploader, SafeMulterS3Options} from '../providers/types';
import {snakeCase} from 'lodash';
const bucket = process.env.S3_FILE_BUCKET ?? '';
export class FileUploadController {
  constructor(
    @inject(FileUploadBindings.SafeMulterS3Provider)
    private readonly multerS3Provider: IUploader,
    @service(FileHelperService)
    private readonly fileHelperService: FileHelperService,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: ['*']})
  @post('/file-upload', {
    description: 'file upload',
    responses: {
      '200': 'Excel file successfully uploaded on S3',
    },
  })
  async uploadFile(
    @requestBody({
      description: 'multipart/form-data value.',
      required: true,
      content: {
        'multipart/form-data': {
          // Skip body parsing
          'x-parser': 'stream',
          schema: {type: 'object'},
        },
      },
    })
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @inject(AWSS3Bindings.AwsS3Provider) s3: AWS.S3,
  ): Promise<AnyObject> {
    const safeMulterS3Options: SafeMulterS3Options = {
      s3,
      bucket,
      key: (_req, file, cb) => {
        const fileSplitArr = file.originalname.split('.');
        const fileExt = fileSplitArr[fileSplitArr.length - 1];
        const fileName = fileSplitArr.splice(-1, 1).join('_');
        cb(null, `${Date.now()}_${snakeCase(fileName)}.${fileExt}`);
      },
    };
    // sonarignore:start
    let uploadResp;
    try {
      uploadResp = await this.multerS3Provider.uploadAny(
        safeMulterS3Options,
        request,
        response,
      );
    } catch (err) {
      throw new HttpErrors.UnprocessableEntity(err.message);
    }
    if (
      !((uploadResp as AnyObject)?.files as Express.Multer.File[])?.every(
        file => file.filename,
      )
    ) {
      throw new HttpErrors.UnprocessableEntity('Unable to upload files');
    }
    const {filename: fileKey} = (
      (uploadResp as AnyObject).files as Express.Multer.File[]
    )[0];
    return {
      fileKey,
    };
  }
}
