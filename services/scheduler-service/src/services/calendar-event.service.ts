import {bind, BindingScope} from '@loopback/core';
import {Where, Filter, repository} from '@loopback/repository';
import {SubscriptionRepository} from '../repositories';
import {EventAttendeeView} from '../models';

@bind({scope: BindingScope.TRANSIENT})
export class CalendarEventService {
  constructor(
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
  ) {}

  async primarySubscription(calendarId: string) {
    return this.subscriptionRepository.findOne({
      where: {
        and: [{calendarId: calendarId}, {isPrimary: true}],
      },
    });
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

  getFilter(
    identifier: string,
    whereClause: Where,
    filter?: Filter<EventAttendeeView>,
  ) {
    if (filter) {
      if (filter.where) {
        filter.where = {
          and: [
            whereClause,
            filter.where,
            {
              or: [{identifier: identifier}, {attendeeIdentifier: identifier}],
            },
          ],
        };
      } else {
        filter.where = {
          and: [
            whereClause,
            {
              or: [{identifier: identifier}, {attendeeIdentifier: identifier}],
            },
          ],
        };
      }
    } else {
      filter = {
        where: {
          and: [
            whereClause,
            {
              or: [{identifier: identifier}, {attendeeIdentifier: identifier}],
            },
          ],
        },
      };
    }
    return filter;
  }
}
