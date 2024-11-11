// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  BindingScope,
  inject,
  injectable,
  Interceptor,
  InvocationContext,
  Next,
  Provider,
  service,
  Setter,
} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {Request, Response, RestBindings} from '@loopback/rest';
import multer from 'multer';
import {FileUtilBindings} from '../keys';
import {FileValidatorService} from '../services';
import {ParsedMultipartData} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class MulterMiddleware implements Provider<Interceptor> {
  constructor(
    @inject(FileUtilBindings.MulterInstance)
    private readonly multerInstance: multer.Multer,
    @inject.setter(FileUtilBindings.PARSED_DATA)
    private readonly setCurrentFile: Setter<AnyObject>,
    @service(FileValidatorService)
    private readonly validator: FileValidatorService,
    @inject(RestBindings.Http.REQUEST)
    private readonly request: Request,
    @inject(RestBindings.Http.RESPONSE)
    private readonly response: Response,
  ) {}
  value() {
    const middleware = async (ctx: InvocationContext, next: Next) => {
      const parsedData = await this.handleRequest(this.request, this.response);
      if (parsedData) {
        await this.validator.validateParsedData(parsedData);
        this.setCurrentFile(parsedData);
      }
      return next();
    };
    return middleware;
  }

  private handleRequest(
    req: Request,
    res: Response,
  ): Promise<ParsedMultipartData> {
    return new Promise((resolve, reject) => {
      const handler = this.multerInstance.any();
      handler(req, res, err => {
        if (err) {
          return reject(err);
        }
        let fileFields: AnyObject = {};
        if (Array.isArray(req.files) && req.files.length) {
          fileFields = req.files?.reduce((map, file) => {
            map[file.fieldname] = file;
            return map;
          }, fileFields);
        }
        resolve({
          ...req.body,
          ...fileFields,
          ...(req.file ? {[req.file.fieldname]: req.file} : {}),
        });
      });
    });
  }
}
