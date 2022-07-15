// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export interface DecisionRequirementDefinition {
  id: string;
  key: string;
  category: string;
  name: string;
  version: number;
  resource: string;
  deploymentId: string;
  tenantId: string;
}
