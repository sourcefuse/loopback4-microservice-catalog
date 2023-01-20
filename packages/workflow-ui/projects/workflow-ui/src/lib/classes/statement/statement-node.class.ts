import {WorkflowNode} from '../../types/base.types';
import {WorkflowElement} from '../element/abstract-element.class';
import {WorkflowPrompt} from '../nodes';

export class StatementNode<E> {
  inputs: WorkflowPrompt;
  element: WorkflowElement<E>;
  workflowNode: WorkflowNode<E>;
  tag: E;
  incoming: string;
  outgoing: string;
  next: StatementNode<E>[];
  prev: StatementNode<E>[];

  /**
   * The constructor function takes in a WorkflowElement and a WorkflowNode and sets the element and
   * workflowNode properties of the WorkflowElementNode object
   * @param element - The element that is being added to the workflow.
   * @param [node] - WorkflowNode<E>
   */
  constructor(element: WorkflowElement<E>, node?: WorkflowNode<E>) {
    this.element = element;
    if (node) {
      this.workflowNode = node;
    }
  }

  /**
   * If the tag parameter is truthy, then set the tag property to the tag parameter
   * @param {E} tag - The tag to set.
   */
  setTag(tag: E) {
    if (tag) {
      this.tag = tag;
    }
  }
}
