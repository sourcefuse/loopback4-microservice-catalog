import {Entity, model, property} from '@loopback/repository';
import {LoginType} from '../enums/login-type.enum';

@model({
  description: `This is to maintain the daily login activity.`,
  name: 'login_activity',
})
export class LoginActivity extends Entity {
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
  tenantId?: string;

  @property({
    type: 'date',
    default: () => new Date(),
    name: 'login_time',
  })
  loginTime: Date;

  @property({
    type: 'object',
    name: 'token_payload',
  })
  tokenPayload?: object;

  @property({
    type: 'string',
    name: 'login_type',
  })
  loginType: LoginType;

  @property({
    type: 'string',
    name: 'device_info',
  })
  deviceInfo: string;

  @property({
    type: 'string',
    name: 'ip_address',
  })
  ipAddress: string;

  constructor(data?: Partial<LoginActivity>) {
    super(data);
  }
}
