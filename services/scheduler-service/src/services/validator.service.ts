import {bind, BindingScope, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  CalendarRepository,
  EventRepository,
  SubscriptionRepository,
} from '../repositories';

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

    if (calendar) return true;
    else return false;
  }

  minMaxTime(timeMin?: Date, timeMax?: Date) {
    console.log(timeMin, timeMax);
    if (timeMax && timeMin && timeMax < timeMin) return false;
    else return true;
  }

  async eventExists(eventId?: string) {
    const event = await this.eventRepository.findOne({
      where: {
        id: eventId,
      },
    });

    if (event) return true;
    else return false;
  }

  async primaryToCalendarId(id: string) {
    if (id === 'primary') {
      const subcription = await this.subscriptionRepository.findOne({
        where: {
          and: [{subscriber: this.currentUser.email}, {isPrimary: true}],
        },
      });
      if (subcription) id = subcription.calendarId;
      else return null;
    }
    return id;
  }
}
