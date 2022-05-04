import {WorkflowElement} from '../element/abstract-element.class';
import {Constructor, RecordOfAnyType} from '../../types/base.types';
import {StatementNode} from '../statement';

export abstract class ElementService<T> {
  abstract createElement(
    ctor: Constructor<WorkflowElement<T>>,
    node: StatementNode<T>,
    attrs?: RecordOfAnyType,
  ): T;
  abstract createElementByName(
    name: string,
    node: StatementNode<T>,
    attrs?: RecordOfAnyType,
  ): T;
  abstract createInstance(
    ctor: Constructor<WorkflowElement<T>>,
  ): WorkflowElement<T>;
  abstract createInstanceByName(name: string): WorkflowElement<T>;
}
