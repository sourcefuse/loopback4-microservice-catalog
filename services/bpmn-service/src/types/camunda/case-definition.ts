export interface CaseDefinition {
  id: string;
  key: string;
  category: string;
  name: string;
  version: number;
  resource: string;
  deploymentId: string;
  tenantId: string;
  historyTimeToLive: number;
}
