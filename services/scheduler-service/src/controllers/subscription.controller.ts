import {inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
} from '@loopback/rest';
import {
  IAuthUserWithPermissions,
  STATUS_CODE,
  CONTENT_TYPE,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Subscription} from '../models';
import {AccessRoleType} from '../models/enums/access-role.enum';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {SubscriptionRepository} from '../repositories';
import {ValidatorService} from '../services/validator.service';
import { ISchedulerConfig } from '../types';
import { SchedulerBindings } from '../keys';
import { IdentifierType } from '../models/enums/identifier-type.enum';

const basePath = '/subscriptions';

export class SubscriptionController {
  constructor(
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
    @service(ValidatorService) public validatorService: ValidatorService,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
    @inject(SchedulerBindings.Config, {
      optional: true,
    })
    private readonly schdulerConfig?: ISchedulerConfig
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.CreateSubscription])
  @post(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Subscription)},
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Subscription, {
            title: 'NewSubscription',
            exclude: ['id'],
          }),
        },
      },
    })
    subscription: Omit<Subscription, 'id'>,
  ): Promise<Subscription> {
    return this.subscriptionRepository.create(subscription);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewSubscription])
  @get(`${basePath}/count`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Subscription) where?: Where<Subscription>,
  ): Promise<Count> {
    return this.subscriptionRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewSubscription])
  @get('calendars/subscriptions/me', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Subscription model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Subscription, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Subscription) filter?: Filter<Subscription>,
    @param.query.string('minAccessRole') minAccessRole?: AccessRoleType,
  ): Promise<Subscription[]> {
    let identifierType = this.schdulerConfig?.identifierMappedTo;
    if (!identifierType){
      identifierType = IdentifierType.Id;
    }
    return this.subscriptionRepository.find({
      include: [
        {
          relation: 'calendar',
          scope: {
            fields: {
              id: true,
              location: true,
              ownerDisplayName: true,
              ownerEmail: true,
              summary: true,
              timezone: true,
            },
          },
        },
      ],
      where: {
        and: [
          {identifier: this.currentUser[identifierType]},
          {accessRole: minAccessRole},
        ],
      },
    });
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateSubscription])
  @patch(basePath, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Subscription, {partial: true}),
        },
      },
    })
    subscription: Subscription,
    @param.where(Subscription) where?: Where<Subscription>,
  ): Promise<Count> {
    return this.subscriptionRepository.updateAll(subscription, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewSubscription])
  @get(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Subscription model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Subscription, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Subscription, {exclude: 'where'})
    filter?: FilterExcludingWhere<Subscription>,
  ): Promise<Subscription> {
    return this.subscriptionRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateSubscription])
  @patch(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscription PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Subscription, {partial: true}),
        },
      },
    })
    subscription: Subscription,
  ): Promise<void> {
    await this.subscriptionRepository.updateById(id, subscription);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.UpdateSubscription])
  @put(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscription PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() subscription: Subscription,
  ): Promise<void> {
    await this.subscriptionRepository.replaceById(id, subscription);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.DeleteSubscription])
  @del(`${basePath}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Subscription DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.subscriptionRepository.deleteById(id);
  }
}
