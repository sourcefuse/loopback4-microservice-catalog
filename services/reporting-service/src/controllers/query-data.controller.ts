// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository, DataObject} from '@loopback/repository';
import {post, requestBody} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {IReporting, ReportingBindings} from '../providers';
import {MetabaseTokenRepository, QueriesRepository} from '../repositories';

export class QueryDataController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER)
    private user: DataObject<{role: string}>,
    @repository(QueriesRepository)
    public queriesRepository: QueriesRepository,
    @repository(MetabaseTokenRepository)
    public sessionTokenRepository: MetabaseTokenRepository,
    @inject(ReportingBindings.ReportingHelper)
    private readonly reportingHelper: IReporting,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['MetaBase']})
  @post(`/query/data`, {
    responses: {
      [STATUS_CODE.OK]: 'Metabase instance',
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            type: 'object',
          },
        },
      },
    },
  })
  async metabaseTest(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: {
            type: 'object',
          },
        },
      },
    })
    requestObject: DataObject<{queryId: string}>,
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const user = this.user;
    const userRole = user?.role ?? '';

    if (requestObject?.hasOwnProperty('queryId') === false) {
      return 'queryId is mandatory';
    } else {
      const data = await this.reportingHelper.getQueryData(
        requestObject.queryId,
        userRole,
      );
      return data;
    }
  }
}
