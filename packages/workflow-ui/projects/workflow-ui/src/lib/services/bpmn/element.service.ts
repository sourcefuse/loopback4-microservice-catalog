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
    private readonly elements: WorkflowElement<E>[],
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
    element: WorkflowElement<E>,
    node: StatementNode<E>,
    attributes?: RecordOfAnyType,
  ) {
    const builder = this.cloneInstance(element);
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

  // sonarignore:start
  // TODO: Refactor this code
  // sonarignore:end
  cloneInstance(element: WorkflowElement<E>) {
    return Object.assign(Object.create(element.constructor.prototype), element);
  }

  /**
   * It takes a string name and returns an instance of the element class that has that name
   * @param {string} element - the name of the element to create
   * @returns An instance of the class that was passed in.
   */
  createInstanceByName(element: string) {
    const instance = this.elements.find(e => e.constructor.name === element);
    if (!instance) {
      throw new NotProvided(element);
    }
    return this.cloneInstance(instance);
  }
}
