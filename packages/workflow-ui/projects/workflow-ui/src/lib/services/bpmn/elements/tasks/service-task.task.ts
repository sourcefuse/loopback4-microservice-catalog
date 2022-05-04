import {BpmnElement, RecordOfAnyType} from '../../../../types';
import {ElementTypes} from '../../../../enum';
export abstract class ServiceTaskElement extends BpmnElement {
  constructor() {
    super();
    this.attributes = {
      'camunda:type': 'external',
    };
  }
  tag = 'bpmn:ServiceTask';
  type = ElementTypes.ServiceTask;
  attributes: RecordOfAnyType;
}
