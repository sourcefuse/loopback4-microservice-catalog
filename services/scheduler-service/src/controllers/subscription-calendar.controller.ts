import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Calendar, Subscription} from '../models';
import {PermissionKey} from '../models/enums/permission-key.enum';
import {SubscriptionRepository} from '../repositories';

export class SubscriptionCalendarController {
  constructor(
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
  ) {}

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize([PermissionKey.ViewCalendar])
  @get('/subscriptions/{id}/calendar', {
    responses: {
      '200': {
        description: 'Calendar belonging to Subscription',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Calendar)},
          },
        },
      },
    },
  })
  async getCalendar(
    @param.path.string('id') id: typeof Subscription.prototype.id,
  ): Promise<Calendar> {
    return this.subscriptionRepository.calendar(id);
  }
}
