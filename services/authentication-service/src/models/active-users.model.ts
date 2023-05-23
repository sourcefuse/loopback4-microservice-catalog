import {Entity, model, property} from '@loopback/repository';

@model({
  description: `This is to maintain the daily active users list.`,
  settings: {strict: true},
  name: 'active_users',
})
export class ActiveUsers extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    name: 'actor',
  })
  actor: string;

  @property({
    type: 'string',
    name: 'tenant_id',
  })
  tenantId: string;

  @property({
    type: 'date',
    default: () => new Date(),
    name: 'login_time',
  })
  loginTime?: Date;

  @property({
    type: 'object',
    name: 'token_payload',
  })
  tokenPayload?: object;

  constructor(data?: Partial<ActiveUsers>) {
    super(data);
  }
}
