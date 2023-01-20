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
import {GatewayElement} from '../../elements';

@Injectable()
export class CreateGatewayStrategy implements CreateStrategy<ModdleElement> {
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
    (element as GatewayElement).elseOutGoing =
      (element as GatewayElement).elseOutGoing ?? `Flow_${this.utils.uuid()}`;
    (element as GatewayElement).default =
      (element as GatewayElement).default ?? `Flow_${this.utils.uuid()}`;
    return this.moddle.create(element.tag, {
      id: element.id,
      name: 'Gateway',
      ...this.parseAttributes(attrs, node),
    });
  }

  /**
   * It takes an object of attributes and a node, and if any of the attributes are objects with a key
   * of 'state', it replaces the attribute with the value of the state variable
   * @param {RecordOfAnyType} attrs - RecordOfAnyType - this is the attributes object that is passed to
   * the node.
   * @param {BpmnStatementNode} node - The current node being processed
   * @returns The attributes of the node.
   */
  private parseAttributes(attrs: RecordOfAnyType, node: BpmnStatementNode) {
    Object.keys(attrs).forEach(key => {
      if (
        typeof attrs[key] !== 'string' &&
        Object.keys(attrs[key])[0] === 'state'
      ) {
        attrs[key] = node.workflowNode.state.get(attrs[key].state);
      }
    });
    return attrs;
  }
}
