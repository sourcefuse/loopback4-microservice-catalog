import { NodeTypes } from '../../../enum';
import { BpmnEvent } from '../../../types/bpmn.types';
import { TriggerOnInterval } from '../../bpmn/elements/tasks/trigger-on-interval.task';
import { ValueInput } from '../inputs/value.input';

export class OnIntervalEvent extends BpmnEvent {
  groupType: NodeTypes;
  groupId: string;
  trigger = true;
  elements = [TriggerOnInterval];
  name = 'On Interval';
  statement = 'Every ';
  properties = {};
  prompts = [ValueInput];
  constructor(id: string, groupType: NodeTypes, groupId: string) {
    super();
    this.id = id;
    this.groupType = groupType;
    this.groupId = groupId;
  }
}
