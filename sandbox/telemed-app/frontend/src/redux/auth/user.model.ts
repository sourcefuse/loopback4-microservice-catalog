export type User = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName?: string;
  username: string;
  email?: string;
  phone?: string;
  lastLogin: Date;
  dob: Date;
  gender?: string;
  defaultTenantId: string;
  permissions: string[];
  role: string;
  userPreferences: any;
  tenantId: string;
  userTenantId?: string;
  status: number;
};
