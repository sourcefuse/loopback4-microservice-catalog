import {Injectable} from '@angular/core';
import {WorkflowElement} from '../../../../classes';
import {LinkStrategy} from '../../../../interfaces';
import {
  BpmnStatementNode,
  CustomBpmnModdle,
  ModdleElement,
} from '../../../../types/bpmn.types';
import {UtilsService} from '../../../utils.service';

@Injectable()
export class BasicLinkStrategy implements LinkStrategy<ModdleElement> {
  constructor(
    private readonly moddle: CustomBpmnModdle,
    private readonly utils: UtilsService,
  ) {}

  /**
   * It creates a link between two nodes
   * @param element - WorkflowElement<ModdleElement>
   * @param {BpmnStatementNode} node - BpmnStatementNode
   * @returns The link between the two nodes.
   */
  execute(
    element: WorkflowElement<ModdleElement>,
    node: BpmnStatementNode,
  ): ModdleElement[] {
    const from = node.tag;
    const to = node.next[0].tag;
    const id = node.outgoing ?? `Flow_${this.utils.uuid()}`;
    node.next[0].incoming = id;

    const start = this.moddle.create('bpmn:FlowNode', {
      id: from.id,
    });
    const end = this.moddle.create('bpmn:FlowNode', {
      id: to.id,
    });
    const attrs = {
      id: id,
      sourceRef: start,
      targetRef: end,
    };
    const link = this.moddle.create('bpmn:SequenceFlow', attrs);
    const outgoing = from.get('outgoing');
    const incoming = to.get('incoming');
    if (!outgoing.find((item: ModdleElement) => item.id === id)) {
      outgoing.push(link);
    }
    if (!incoming.find((item: ModdleElement) => item.id === id)) {
      incoming.push(link);
    }
    return [link];
  }
}
