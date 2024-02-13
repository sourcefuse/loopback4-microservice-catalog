export interface PermissionModel {
  userIds: string[];
  userGroups?: string[];
  roles?: string[];
  recordId: string; //this would be the same as primaryKey
  recordType: string;
  accessType: 'read';
}
