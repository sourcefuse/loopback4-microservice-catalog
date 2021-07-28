import {CaseDefinition} from './case-definition';
import {DecisionDefinition} from './decision-definition';
import {DecisionRequirementDefinition} from './decision-requirements-definition';
import {ProcessDefinition} from './process-definition';
import {Link} from './types';

export interface DeploymentWithDefinitions {
  links: Link[];
  id: string;
  name: string;
  source: string;
  tenantId: string;
  deploymentTime: string;
  deployedProcessDefinitions: DeployedProcessDefinitions;
  deployedCaseDefinitions: DeployedCaseDefinitions;
  deployedDecisionDefinitions: DeployedDecisionDefinitions;
  deployedDecisionRequirementsDefinitions: DeployedDecisionRequirementDefinitions;
}

export type DeployedProcessDefinitions = {
  [definitionId: string]: ProcessDefinition;
};

export type DeployedCaseDefinitions = {
  [definitionId: string]: CaseDefinition;
};

export type DeployedDecisionDefinitions = {
  [definitionId: string]: DecisionDefinition;
};

export type DeployedDecisionRequirementDefinitions = {
  [definitionId: string]: DecisionRequirementDefinition;
};
