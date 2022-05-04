import {Injectable} from '@angular/core';
import {WorkflowElement} from '../../../../classes';
import {CreateStrategy} from '../../../../interfaces';
import {RecordOfAnyType} from '../../../../types/base.types';
import {
  BpmnStatementNode,
  CustomBpmnModdle,
  ModdleElement,
} from '../../../../types/bpmn.types';
import {UtilsService} from '../../../utils.service';

@Injectable()
export class CreateGatewayStrategy implements CreateStrategy<ModdleElement> {
  constructor(
    private readonly moddle: CustomBpmnModdle,
    private readonly utils: UtilsService,
  ) {}
  execute(
    element: WorkflowElement<ModdleElement>,
    node: BpmnStatementNode,
    attrs: RecordOfAnyType,
  ): ModdleElement {
    element.id = `${element.constructor.name}_${node.workflowNode.constructor.name}_${node.workflowNode.id}`;
    node.outgoing = `Flow_${this.utils.uuid()}`;
    return this.moddle.create(element.tag, {
      id: element.id,
      name: 'Gateway',
      ...attrs,
    });
  }
}
