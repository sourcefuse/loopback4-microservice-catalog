import * as fs from 'fs';
import * as path from 'path';
import {inject} from '@loopback/context';
import {RestBindings, Response} from '@loopback/rest';
import {sourceloopGet, STATUS_CODE} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';

export class HomePageController {
  private readonly html: string;
  constructor(
    @inject(RestBindings.Http.RESPONSE)
    private readonly response: Response,
  ) {
    this.html = fs.readFileSync(
      path.join(__dirname, '../../public/index.html'),
      'utf-8',
    );
  }

  @sourceloopGet('/', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Home Page',
        content: {'text/html': {schema: {type: 'string'}}},
      },
    },
  })
  @authorize({permissions: ['*']})
  homePage(): Response {
    this.response.status(STATUS_CODE.OK).contentType('html').send(this.html);
    return this.response;
  }
}
