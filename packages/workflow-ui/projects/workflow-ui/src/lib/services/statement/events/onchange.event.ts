import { NodeTypes, StartElementTypes } from '../../../enum';
import { BpmnEvent } from '../../../types/bpmn.types';
import { GatewayElement } from '../../bpmn/elements/gateways/gateway.element';
import { ReadColumnValue } from '../../bpmn/elements/tasks/read-column.task';
import { TriggerWhenColumnChanges } from '../../bpmn/elements/tasks/trigger-when-column-changes.task';
import { ColumnInput } from '../inputs/column.input';
import { ConditionInput } from '../inputs/condition.input';
import { ValueInput } from '../inputs/value.input';

export class OnChangeEvent extends BpmnEvent {
  groupType: NodeTypes;
  groupId: string;
  trigger = true;
  startElement = StartElementTypes.BasicStartElement;
  elements = [TriggerWhenColumnChanges, ReadColumnValue, GatewayElement];
  name = 'On Column Value Change';
  statement = 'When ';
  properties = {};
  prompts = [ColumnInput, ConditionInput, ValueInput];
  constructor(id: string, groupType: NodeTypes, groupId: string) {
    super();
    this.id = id;
    this.groupType = groupType;
    this.groupId = groupId;
  }
}
