import {inject} from '@loopback/core';
import {Request, RestBindings, get, ResponseObject} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {STATUS_CODE} from '@sourceloop/core';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
  ) {}

  // Map to `GET /ping`
  @authorize({permissions: ['*']})
  @get('/ping', {
    responses: {
      [STATUS_CODE.OK]: PING_RESPONSE,
    },
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
