import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Calendar, Subscription} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {CalendarRepository} from '../repositories';
import {STATUS_CODE, CONTENT_TYPE,OPERATION_SECURITY_SPEC,} from '@sourceloop/core';

const basePath = '/calendars/{id}/subscriptions';

export class CalendarSubscriptionController {
  constructor(
    @repository(CalendarRepository)
    protected calendarRepository: CalendarRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.ViewSubscription]})
  @get(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Calendar has many Subscriptions',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Subscription),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Subscription>,
  ): Promise<Subscription[]> {
    return this.calendarRepository.subscriptions(id).find(filter);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.CreateSubscription]})
  @post(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar model instance',
        content: {
          [CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Subscription)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Calendar.prototype.id,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Subscription, {
            title: 'NewSubscriptionInCalendar',
            exclude: ['id'],
            optional: ['calendarId'],
          }),
        },
      },
    })
    subscription: Omit<Subscription, 'id'>,
  ): Promise<Subscription> {
    return this.calendarRepository.subscriptions(id).create(subscription);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.UpdateSubscription]})
  @patch(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar.Subscription PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Subscription, {partial: true}),
        },
      },
    })
    subscription: Partial<Subscription>,
    @param.query.object('where', getWhereSchemaFor(Subscription))
    where?: Where<Subscription>,
  ): Promise<Count> {
    return this.calendarRepository.subscriptions(id).patch(subscription, where);
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: [PermissionKey.DeleteSubscription]})
  @del(basePath, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Calendar.Subscription DELETE success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Subscription))
    where?: Where<Subscription>,
  ): Promise<Count> {
    return this.calendarRepository.subscriptions(id).delete(where);
  }
}
