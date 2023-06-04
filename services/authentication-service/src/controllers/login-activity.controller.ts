import {
  Count,
  CountSchema,
  Filter,
  Where,
  repository,
} from '@loopback/repository';
import {LoginActivityRepository} from '../repositories';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {
  ResponseObject,
  RestBindings,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {LoginActivity} from '../models';
import {ActiveUsersRange, PermissionKey} from '../enums';
import {ActiveUsersGroupData} from '../types';
import {inject} from '@loopback/core';
import moment from 'moment';

const baseUrl = '/login-activity';

export class LoginActivityController {
  constructor(
    @repository(LoginActivityRepository)
    private readonly loginActivityRepo: LoginActivityRepository,
    @inject(RestBindings.Http.RESPONSE) private response: ResponseObject,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewLoginActivity],
  })
  @get(`${baseUrl}/count`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'LoginActivity model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(LoginActivity))
    where?: Where<LoginActivity>,
  ): Promise<Count> {
    return this.loginActivityRepo.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewLoginActivity],
  })
  @get(baseUrl, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of LoginActivity model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(LoginActivity, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(LoginActivity))
    filter?: Filter<LoginActivity>,
  ): Promise<LoginActivity[]> {
    return this.loginActivityRepo.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewLoginActivity],
  })
  @get(`${baseUrl}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'LoginActivity model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(LoginActivity, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(LoginActivity))
    filter?: Filter<LoginActivity>,
  ): Promise<LoginActivity> {
    return this.loginActivityRepo.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({
    permissions: [PermissionKey.ViewLoginActivity],
  })
  @get(`active-users/{range}`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'LoginActivity model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Object, {includeRelations: true}),
          },
        },
      },
    },
  })
  async getActiveUsers(
    @param.path.string('range') range: ActiveUsersRange,
    @param.query.dateTime('startDate')
    startDate: Date,
    @param.query.dateTime('endDate') endDate: Date,
  ): Promise<ActiveUsersGroupData> {
    const activeUsersForTime = await this.loginActivityRepo.find({
      where: {
        loginTime: {between: [startDate, endDate]},
      },
    });

    //all the BL here

    const groupByDate: ActiveUsersGroupData = {};
    activeUsersForTime.forEach(item => {
      let date = '';
      const loginTime = moment(item.loginTime);
      if (range === ActiveUsersRange.DAILY) {
        date = loginTime.format('YYYY-MM-DD');
      } else if (range === ActiveUsersRange.MONTHLY) {
        date = loginTime.format('MM-YYYY');
      } else {
        //intentional
      }

      if (!groupByDate[date]) {
        groupByDate[date] = {};
      }
      const type = item.loginType;

      if (!groupByDate[date][type]) {
        groupByDate[date][type] = [];
      }

      const isDuplicate = groupByDate[date][type].some(
        existItem => existItem.actor === item.actor,
      );
      if (!isDuplicate) {
        groupByDate[date][type].push(item);
      }
    });

    return groupByDate;
  }
}
