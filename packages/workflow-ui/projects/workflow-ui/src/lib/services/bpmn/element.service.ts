import {Inject, Injectable, Injector} from '@angular/core';
import {WorkflowElement} from '../../classes/element';
import {ElementService} from '../../classes/services';
import {StatementNode} from '../../classes/statement';
import {BPMN_ELEMENTS} from '../../const';
import {InvalidEntityError, NotProvided} from '../../errors/base.error';
import {Constructor, DecoratedContructor, RecordOfAnyType} from '../../types';
@Injectable()
export class BpmnElementService<E> implements ElementService<E> {
  constructor(
    @Inject(BPMN_ELEMENTS)
    private readonly elements: Constructor<WorkflowElement<E>>[],
    private readonly injector: Injector,
  ) {}

  createElement(
    element: Constructor<WorkflowElement<E>>,
    node: StatementNode<E>,
    attributes?: RecordOfAnyType,
  ) {
    const builder = this.createInstance(element);
    if (builder) {
      return builder.create(node, attributes);
    } else {
      throw new InvalidEntityError(element.name);
    }
  }

  createElementByName(
    name: string,
    node: StatementNode<E>,
    attributes?: RecordOfAnyType,
  ): E {
    const builder = this.createInstanceByName(name);
    if (builder) {
      return builder.create(node, attributes);
    } else {
      throw new InvalidEntityError(name);
    }
  }

  createInstance(element: Constructor<WorkflowElement<E>>) {
    const params = this.getConstructorParams(
      element as DecoratedContructor<WorkflowElement<E>>,
    );
    return new element(...params);
  }

  createInstanceByName(element: string) {
    const ctor = this.elements.find(e => e.name === element);
    if (!ctor) {
      throw new NotProvided(element);
    }
    return this.createInstance(ctor);
  }

  private getConstructorParams(ctor: DecoratedContructor<WorkflowElement<E>>) {
    if (!ctor.ctorParameters) {
      return [];
    }
    return ctor
      .ctorParameters()
      .map(r => r.decorators?.[0].args[0] || r.type)
      .map(token => this.injector.get(token));
  }
}
