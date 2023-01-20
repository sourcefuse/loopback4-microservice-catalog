import {StatementNode} from '../classes';
import {WorkflowElement} from '../classes/element/abstract-element.class';

/* A generic interface that defines a function called execute that takes in two parameters, element and
node. */
export interface LinkStrategy<E> {
  execute(element: WorkflowElement<E>, node: StatementNode<E>): E[];
}
