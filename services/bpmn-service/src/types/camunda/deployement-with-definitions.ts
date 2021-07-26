import {Link} from './types';

export interface DeploymentWithDefinitions {
  links: Link[];
  id: string;
  name: string;
  source: string;
  tenantId: string;
  deploymentTime: string;
  deployedProcessDefinitions: string;
  deployedCaseDefinitions: string;
  deployedDecisionDefinitions: string;
  deployedDecisionRequirementsDefinitions: string;
}
