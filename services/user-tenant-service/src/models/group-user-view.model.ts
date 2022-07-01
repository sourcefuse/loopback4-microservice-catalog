import {model, property} from '@loopback/repository';
import {Group} from './group.model';
@model({
  name: 'v_user_group',
  settings: {
    defaultIdSort: false,
  },
})
export class UserGroupView extends Group {
  @property({
    name: 'user_tenant_id',
    type: 'string',
  })
  userTenantId: string;

  constructor(data?: Partial<UserGroupView>) {
    super(data);
  }
}
