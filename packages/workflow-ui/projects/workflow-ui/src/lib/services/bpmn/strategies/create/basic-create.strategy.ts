import {Injectable} from '@angular/core';
import {UtilsService} from '../../../utils.service';
import {CreateStrategy} from '../../../../interfaces';
import {
  BpmnStatementNode,
  CustomBpmnModdle,
  ModdleElement,
  RecordOfAnyType,
} from '../../../../types';
import {WorkflowElement} from '../../../../classes';

@Injectable()
export class CreateBasicStrategy implements CreateStrategy<ModdleElement> {
  constructor(
    private readonly moddle: CustomBpmnModdle,
    private readonly utils: UtilsService,
  ) {}
  /**
   * It creates a new BPMN element, assigns it an ID, and returns it
   * @param element - WorkflowElement<ModdleElement>
   * @param {BpmnStatementNode} node - BpmnStatementNode
   * @param {RecordOfAnyType} attrs - RecordOfAnyType
   * @returns A ModdleElement
   */
  execute(
    element: WorkflowElement<ModdleElement>,
    node: BpmnStatementNode,
    attrs: RecordOfAnyType,
  ): ModdleElement {
    element.id = `${element.constructor.name}_${this.utils.uuid()}`;
    return this.moddle.create(element.tag, {
      id: element.id,
      name: element.name,
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
