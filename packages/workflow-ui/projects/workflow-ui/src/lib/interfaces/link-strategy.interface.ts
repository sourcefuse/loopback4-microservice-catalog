import {StatementNode} from '../classes';
import {WorkflowElement} from '../classes/element/abstract-element.class';

export interface LinkStrategy<E> {
  execute(element: WorkflowElement<E>, node: StatementNode<E>): E[];
}
