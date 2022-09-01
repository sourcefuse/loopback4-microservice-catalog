import { WorkflowNode } from '../../types/base.types';
import { WorkflowElement } from '../element/abstract-element.class';
import { WorkflowPrompt } from '../nodes';

export class StatementNode<E> {
  inputs: WorkflowPrompt;
  element: WorkflowElement<E>;
  workflowNode: WorkflowNode<E>;
  tag: E;
  incoming: string;
  outgoing: string;
  next: StatementNode<E>[];
  prev: StatementNode<E>[];
  constructor(element: WorkflowElement<E>, node?: WorkflowNode<E>) {
    this.element = element;
    if (node) {
      this.workflowNode = node;
    }
  }
  setTag(tag: E) {
    if (tag) {
      this.tag = tag;
    }
  }
}