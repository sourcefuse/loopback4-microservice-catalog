import {BpmnAction} from '../../../types/bpmn.types';

export class ReadColumnValueAction extends BpmnAction {
  elements = [];
  name = 'Read Column Value';
  statement = 'read value from ';
  prompts = [];
  constructor(id: string) {
    super();
    this.id = id;
  }
}
