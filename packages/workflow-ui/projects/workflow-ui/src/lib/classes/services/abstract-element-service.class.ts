import {WorkflowElement} from '../element/abstract-element.class';
import {Constructor, RecordOfAnyType} from '../../types/base.types';
import {StatementNode} from '../statement';

export abstract class ElementService<T> {
  abstract createElement(
    element: WorkflowElement<T>,
    node: StatementNode<T>,
    attrs?: RecordOfAnyType,
  ): T;
  abstract createElementByName(
    name: string,
    node: StatementNode<T>,
    attrs?: RecordOfAnyType,
  ): T;
  abstract cloneInstance(element: WorkflowElement<T>): WorkflowElement<T>;
  abstract createInstanceByName(name: string): WorkflowElement<T>;
}
