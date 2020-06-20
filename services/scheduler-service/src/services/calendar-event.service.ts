import {bind, BindingScope} from '@loopback/core';
import {Where, Filter, repository} from '@loopback/repository';
import {SubscriptionRepository} from '../repositories';

@bind({scope: BindingScope.TRANSIENT})
export class CalendarEventService {
  constructor(
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
  ) {}

  async primarySubscription(calendarId: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        and: [{calendarId: calendarId}, {isPrimary: true}],
      },
    });
    return subscription;
  }

  getWhereClause(timeMin?: Date, timeMax?: Date): Where {
    let whereClause = {};

    if (timeMin && timeMax) {
      whereClause = {
        or: [
          {startDateTime: {between: [timeMin, timeMax]}},
          {endDateTime: {between: [timeMin, timeMax]}},
          {
            and: [
              {startDateTime: {lte: timeMin}},
              {endDateTime: {gte: timeMax}},
            ],
          },
        ],
      };
    } else {
      if (timeMin) {
        whereClause = {endDateTime: {gte: timeMin}};
      }

      if (timeMax) {
        whereClause = {startDateTime: {lte: timeMax}};
      }
    }

    return whereClause;
  }

  getFilter(email: string, whereClause: Where, filter?: Filter) {
    let whereFromFilter = {};
    if (filter) {
      if (filter.where) {
        whereFromFilter = Object.assign(filter.where, whereFromFilter);
      }
      filter.where = {
        and: [
          whereClause,
          whereFromFilter,
          {
            or: [{organizerEmail: email}, {email: email}],
          },
        ],
      };
    } else {
      filter = {
        where: {
          and: [
            whereClause,
            {
              or: [{organizerEmail: email}, {email: email}],
            },
          ],
        },
      };
    }
    return filter;
  }
}
