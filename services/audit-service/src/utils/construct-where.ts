import {Where} from '@loopback/repository';
import {CustomFilter} from '../models';

export async function constructWhere(customFilter: CustomFilter) {
  const where: Where = {and: []};

  if (customFilter.date?.fromDate && customFilter.date.toDate) {
    where.and.push({
      actedAt: {
        between: [
          new Date(customFilter.date.fromDate),
          new Date(customFilter.date.toDate),
        ],
      },
    });
  }

  if (customFilter.deleted !== undefined) {
    if (customFilter.deleted) {
      /*If deleted is true then include those entries will get included for after is null
        that is if the particular entry has been deleted*/
      where.and.push({
        or: [
          {after: null},
          {
            after: {
              regexp: `"{0,1}deleted"{0,1}\s*:\s*${customFilter.deleted}`,
            },
          },
        ],
      });
    } else {
      where.and.push({
        after: {
          regexp: `"{0,1}deleted"{0,1}\s*:\s*${customFilter.deleted}`,
        },
      });
    }
  }
  if (customFilter.entityId) {
    where.and.push({
      entityId: customFilter.entityId,
    });
  }

  if (customFilter.actedOn) {
    where.and.push({
      actedOn: {inq: customFilter.actedOn},
    });
  }

  if (customFilter.actionGroup) {
    where.and.push({
      actionGroup: {inq: customFilter.actionGroup},
    });
  }
  return where;
}
