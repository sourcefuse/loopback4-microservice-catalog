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

  /**
   * "Create an instance of the given element class, and if it's a valid builder, then create the
   * element."
   *
   * @param element - The constructor of the element you want to create.
   * @param node - The node that the element is being created for.
   * @param {RecordOfAnyType} [attributes] - A map of attributes that are passed to the builder.
   * @returns A new instance of the element.
   */
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

  /**
   * "Create an element by name."
   *
   * The first parameter is the name of the element to create. The second parameter is the node that the
   * element will be created from. The third parameter is a set of attributes that will be passed to the
   * element
   * @param {string} name - The name of the element to create.
   * @param node - The node that the element is being created for.
   * @param {RecordOfAnyType} [attributes] - A dictionary of attributes to be passed to the builder.
   * @returns A new instance of the class that is being created.
   */
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

  /**
   * It creates an instance of an element class by using the class's constructor and passing in the parameters
   * that the constructor needs
   * @param element - Constructor<WorkflowElement<E>>
   * @returns A new instance of the element class with the parameters passed in.
   */
  createInstance(element: Constructor<WorkflowElement<E>>) {
    const params = this.getConstructorParams(
      element as DecoratedContructor<WorkflowElement<E>>,
    );
    return new element(...params);
  }

  /**
   * It takes a string name and returns an instance of the element class that has that name
   * @param {string} element - the name of the element to create
   * @returns An instance of the class that was passed in.
   */
  createInstanceByName(element: string) {
    const ctor = this.elements.find(e => e.name === element);
    if (!ctor) {
      throw new NotProvided(element);
    }
    return this.createInstance(ctor);
  }

  /**
   * It gets the constructor parameters of a class, and if they have a decorator, it uses the
   * decorator's arguments, otherwise it uses the type of the parameter
   * @param ctor - DecoratedContructor<WorkflowElement<E>>
   * @returns An array of the constructor parameters of the class.
   */
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
