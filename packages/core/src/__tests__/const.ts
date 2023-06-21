import {TenantType} from '../components/tenant-utilities/enums';

export const mockUser1 = {
  tenantId: 'test',
  permissions: [],
  role: 'test',
  authClientId: 0,
  firstName: 'test2',
  lastName: 'test',
  email: 'test',
  username: 'test',
};

export const mockUser2 = {
  tenantId: 'test2',
  permissions: [],
  role: 'test',
  authClientId: 0,
  firstName: 'test2',
  lastName: 'test',
  email: 'test',
  username: 'test',
};

export const mockUserWithoutTenantId = {
  tenantId: '',
  permissions: [],
  role: 'test',
  authClientId: 0,
  firstName: 'test2',
  lastName: 'test',
  email: 'test',
  username: 'test',
};

export const mockSuperAdmin = {
  tenantId: 'super',
  permissions: ['0'],
  tenantType: TenantType.MASTER,
  role: 'test',
  authClientId: 0,
  firstName: 'test2',
  lastName: 'test',
  email: 'test',
  username: 'test',
};
