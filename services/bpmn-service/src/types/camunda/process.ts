// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Link} from './types';
import {Variable} from './variable';

export interface ProcessInstance {
  id: string;
  definitionId: string;
  businessKey: string;
  caseInstanceId: string;
  tenantId: string;
  ended: boolean;
  suspended: boolean;
  links: Link[];
  variables: Variable[];
}
