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
  execute(
    element: WorkflowElement<ModdleElement>,
    node: BpmnStatementNode,
  ): ModdleElement[] {
    const from = node.tag;
    const to = node.next.tag;
    const id = node.outgoing ?? `Flow_${this.utils.uuid()}`;
    node.next.incoming = id;
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
    from.get('outgoing').push(link);
    to.get('incoming').push(link);
    return [link];
  }
}
