import {BpmnEvent} from '../../../types/bpmn.types';
import {GatewayElement} from '../../bpmn/elements/gateways/gateway.element';
import {ReadColumnValue} from '../../bpmn/elements/tasks/read-column.task';
import {ColumnInput} from '../inputs/column.input';
import {ConditionInput} from '../inputs/condition.input';
import {ValueInput} from '../inputs/value.input';

/* The OnChangeEvent class is a BpmnEvent that checks if a column has a particular value */
export class OnValueEvent extends BpmnEvent {
  trigger = false;
  elements = [ReadColumnValue, GatewayElement];
  name = 'Check Value ';
  statement = 'check if ';
  properties = {};
  prompts = [ColumnInput, ConditionInput, ValueInput];
  constructor(id: string) {
    super();
    this.id = id;
  }
}
