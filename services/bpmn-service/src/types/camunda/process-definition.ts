export interface ProcessDefinition {
  id: string;
  key: string;
  category: string;
  description: string;
  name: string;
  version: number;
  resource: string;
  deploymentId: string;
  diagram: string;
  suspended: boolean;
  tenantId: string;
  versionTag: string;
  historyTimeToLive: number;
  startableInTasklist: boolean;
}
