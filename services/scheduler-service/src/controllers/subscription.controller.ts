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
  OPERATION_SECURITY_SPEC,
} from '@sourceloop/core';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Subscription} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {SubscriptionRepository} from '../repositories';
import {ValidatorService} from '../services/validator.service';
import {ISchedulerConfig} from '../types';
import {SchedulerBindings} from '../keys';
import {IdentifierType} from '../models/enums/identifier-type.enum';

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
    private readonly schdulerConfig?: ISchedulerConfig,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateSubscription]})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({permissions: [PermissionKey.ViewSubscription]})
  @get(`${basePath}/count`, {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({permissions: [PermissionKey.ViewSubscription]})
  @get('calendars/subscriptions/me', {
    security: OPERATION_SECURITY_SPEC,
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
  async findMe(
    @param.filter(Subscription) filter?: Filter<Subscription>,
  ): Promise<Subscription[]> {
    let identifierType = this.schdulerConfig?.identifierMappedTo;
    if (!identifierType) {
      identifierType = IdentifierType.Id;
    }

    if (filter) {
      if (filter.where) {
        filter.where = {
          and: [{identifier: this.currentUser[identifierType]}, filter.where],
        };
      } else {
        filter.where = {identifier: this.currentUser[identifierType]};
      }
    } else {
      filter = {where: {identifier: this.currentUser[identifierType]}};
    }
    return this.subscriptionRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewSubscription]})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
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
  ): Promise<Subscription[]> {
    return this.subscriptionRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateSubscription]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({permissions: [PermissionKey.ViewSubscription]})
  @get(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({permissions: [PermissionKey.UpdateSubscription]})
  @patch(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({permissions: [PermissionKey.UpdateSubscription]})
  @put(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
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
  @authorize({permissions: [PermissionKey.DeleteSubscription]})
  @del(`${basePath}/{id}`, {
    security: OPERATION_SECURITY_SPEC,
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
