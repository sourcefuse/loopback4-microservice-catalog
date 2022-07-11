// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export interface DecisionDefinition {
  id: string;
  key: string;
  category: string;
  name: string;
  version: number;
  resource: string;
  deploymentId: string;
  decisionRequirementsDefinitionId: string;
  decisionRequirementsDefinitionKey: string;
  tenantId: string;
  versionTag: string;
  historyTimeToLive: number;
}
