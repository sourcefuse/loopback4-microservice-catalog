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
