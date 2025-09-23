export const ACTED_AT_ORDER = 'actedAt ASC';
export const filterAppliedActedAt = {
  offset: 0,
  limit: 100,
  skip: 0,
  order: [ACTED_AT_ORDER],
  where: {
    and: [
      {
        actedAt: {
          between: ['2023-05-01T00:00:00.000Z', '2023-05-08T23:59:59.999Z'],
        },
        actedOn: 'Product',
      },
    ],
  },
  fields: {
    id: true,
    action: true,
    actedAt: true,
    actedOn: true,
    actionKey: true,
    entityId: true,
    actor: true,
    before: true,
    after: true,
    actionGroup: true,
  },
} as object;
export const filterAppliedActedOn = {
  offset: 0,
  limit: 100,
  skip: 0,
  order: [ACTED_AT_ORDER],
  where: {
    and: [
      {
        actedOn: 'Product',
      },
    ],
  },
  fields: {
    id: true,
    action: true,
    actedAt: true,
    actedOn: true,
    actionKey: true,
    entityId: true,
    actor: true,
    before: true,
    after: true,
    actionGroup: true,
  },
} as object;
export const filterAppliedEntityId = {
  offset: 0,
  limit: 100,
  skip: 0,
  order: [ACTED_AT_ORDER],
  where: {
    and: [
      {
        entityId: '143f43',
      },
    ],
  },
  fields: {
    id: true,
    action: true,
    actedAt: true,
    actedOn: true,
    actionKey: true,
    entityId: true,
    actor: true,
    before: true,
    after: true,
    actionGroup: true,
  },
} as object;
export const incorrectFilter = {
  offset: 0,
  limit: 100,
  skip: 0,
  order: ['string ASC'],
  where: {
    and: [
      {
        actedAt: {
          between: ['2023-05-01T00:00:00.000Z', '2023-05-08T23:59:59.999Z'],
        },
        actedOn: 'Product',
      },
    ],
  },
  fields: {
    id: true,
    action: true,
    actedAt: true,
    actedOn: true,
    actionKey: true,
    entityId: true,
    actor: true,
    before: true,
    after: true,
    actionGroup: true,
  },
} as object;
