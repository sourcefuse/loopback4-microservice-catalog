import {
  BindingScope,
  InvocationContext,
  Next,
  Provider,
  Setter,
  inject,
  injectable,
  Interceptor,
} from '@loopback/core';
import {Request, Response, RestBindings} from '@loopback/rest';
import {FileUtilBindings} from '../keys';
import {ParsedMultipartData} from '../types';
import {AnyObject} from '@loopback/repository';
import multer from 'multer';

@injectable({scope: BindingScope.TRANSIENT})
export class MulterMiddleware implements Provider<Interceptor> {
  constructor(
    @inject.setter(FileUtilBindings.PARSED_DATA)
    private readonly setCurrentFile: Setter<AnyObject>,
    @inject(RestBindings.Http.REQUEST)
    private readonly request: Request,
    @inject(RestBindings.Http.RESPONSE)
    private readonly response: Response,
  ) {}
  value() {
    const middleware = async (ctx: InvocationContext, next: Next) => {
      const parsedData = await this.handleRequest(
        ctx,
        this.request,
        this.response,
      );
      if (parsedData) {
        this.setCurrentFile(parsedData);
      }
      return next();
    };
    return middleware;
  }

  private async handleRequest(
    ctx: InvocationContext,
    req: Request,
    res: Response,
  ): Promise<ParsedMultipartData> {
    const multerInstance = await ctx.get<multer.Multer>(
      FileUtilBindings.MulterInstance,
    );
    const handler = multerInstance.any();

    return new Promise((resolve, reject) => {
      handler(req, res, err => {
        if (err) {
          return reject(err);
        }
        let fileFields: AnyObject = {};
        if (Array.isArray(req.files) && req.files.length) {
          fileFields = req.files?.reduce((map, file) => {
            if (map[file.fieldname]) {
              map[file.fieldname] = Array.isArray(map[file.fieldname])
                ? [...map[file.fieldname], file]
                : [map[file.fieldname], file];
            } else {
              map[file.fieldname] = file;
            }
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
