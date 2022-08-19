import {StatementNode} from '../classes';
import {WorkflowElement} from '../classes/element/abstract-element.class';
import {RecordOfAnyType} from '../types/base.types';

export interface CreateStrategy<E> {
  execute(
    element: WorkflowElement<E>,
    node: StatementNode<E>,
    attrs: RecordOfAnyType,
  ): E;
}
