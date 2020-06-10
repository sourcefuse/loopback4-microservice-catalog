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

const basePath = '/calendars/{id}/subscriptions';

export class CalendarSubscriptionController {
  constructor(
    @repository(CalendarRepository)
    protected calendarRepository: CalendarRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewSubscription])
  @get(basePath, {
    responses: {
      '200': {
        description: 'Array of Calendar has many Subscriptions',
        content: {
          'application/json': {
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
  @authorize([PermissionKey.CreateSubscription])
  @post(basePath, {
    responses: {
      '200': {
        description: 'Calendar model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(Subscription)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Calendar.prototype.id,
    @requestBody({
      content: {
        'application/json': {
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
  @authorize([PermissionKey.UpdateSubscription])
  @patch(basePath, {
    responses: {
      '200': {
        description: 'Calendar.Subscription PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
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
  @authorize([PermissionKey.DeleteSubscription])
  @del(basePath, {
    responses: {
      '200': {
        description: 'Calendar.Subscription DELETE success count',
        content: {'application/json': {schema: CountSchema}},
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
