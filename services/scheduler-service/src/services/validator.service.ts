import {bind, BindingScope, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  CalendarRepository,
  EventRepository,
  SubscriptionRepository,
} from '../repositories';
import {ISchedulerConfig} from '../types';
import {SchedulerBindings} from '../keys';
import {IdentifierType} from '../models/enums/identifier-type.enum';

@bind({scope: BindingScope.TRANSIENT})
export class ValidatorService {
  constructor(
    @repository(CalendarRepository)
    public calendarRepository: CalendarRepository,
    @repository(EventRepository)
    public eventRepository: EventRepository,
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    private readonly currentUser: IAuthUserWithPermissions,
  ) {}

  async calendarExists(calendarId?: string) {
    const calendar = await this.calendarRepository.findOne({
      where: {
        id: calendarId,
      },
    });

    if (calendar) {
      return true;
    } else {
      return false;
    }
  }

  minMaxTime(timeMin?: Date, timeMax?: Date) {
    if (timeMax && timeMin && new Date(timeMax) < new Date(timeMin)) {
      return false;
    } else {
      return true;
    }
  }

  async eventExists(eventId?: string) {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
    });

    if (event) {
      return true;
    } else {
      return false;
    }
  }

  @inject(SchedulerBindings.Config, {
    optional: true,
  })
  private readonly schdulerConfig?: ISchedulerConfig;
  async primaryToCalendarId(id: string) {
    if (id === 'primary') {
      let identifierType = this.schdulerConfig?.identifierMappedTo;
      if (!identifierType) {
        identifierType = IdentifierType.Id;
      }
      const subcription = await this.subscriptionRepository.findOne({
        where: {
          and: [
            {identifier: this.currentUser[identifierType]},
            {isPrimary: true},
          ],
        },
      });
      if (subcription) {
        id = subcription.calendarId;
      } else {
        return null;
      }
    }
    return id;
  }
}
