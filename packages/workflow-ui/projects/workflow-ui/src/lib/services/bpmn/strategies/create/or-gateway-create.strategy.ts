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
import {OrGatewayElement} from '../../elements';

@Injectable()
export class CreateOrGatewayStrategy implements CreateStrategy<ModdleElement> {
  constructor(
    private readonly moddle: CustomBpmnModdle,
    private readonly utils: UtilsService,
  ) {}
  /**
   * It creates a new BPMN element, sets the id, and sets the outgoing flow
   * @param element - WorkflowElement<ModdleElement>
   * @param {BpmnStatementNode} node - BpmnStatementNode - this is the node that is being processed.
   * @param {RecordOfAnyType} attrs - RecordOfAnyType
   * @returns A ModdleElement
   */
  execute(
    element: WorkflowElement<ModdleElement>,
    node: BpmnStatementNode,
    attrs: RecordOfAnyType,
  ): ModdleElement {
    element.id = `${element.constructor.name}_${node.workflowNode.constructor.name}_${node.workflowNode.id}_${node.workflowNode.groupType}_${node.workflowNode.groupId}`;
    node.outgoing = node.outgoing ?? `Flow_${this.utils.uuid()}`;
    (element as OrGatewayElement).elseOutGoing = `Flow_${this.utils.uuid()}`;
    (element as OrGatewayElement).default = `Flow_${this.utils.uuid()}`;
    return this.moddle.create(element.tag, {
      id: element.id,
      name: 'Gateway',
      ...attrs,
    });
  }
}
