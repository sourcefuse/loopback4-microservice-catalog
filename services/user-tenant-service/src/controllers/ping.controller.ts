import {inject} from '@loopback/core';
// import {get, HttpErrors, ResponseObject} from '@loopback/rest';
import {get, ResponseObject} from '@loopback/rest';
import {CONTENT_TYPE, ILogger, LOGGER, STATUS_CODE} from '@sourceloop/core';
import {authorize} from 'loopback4-authorization';
// import {PgdbDataSource} from '../datasources';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    [CONTENT_TYPE.JSON]: {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
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
    // @inject('datasources.pgdb') private readonly dataSource: PgdbDataSource,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
  ) {}

  @authorize({permissions: ['*']})
  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      [STATUS_CODE.OK]: PING_RESPONSE,
    },
  })
  ping(): object {
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'pong',
      date: new Date(),
    };
  }
}
