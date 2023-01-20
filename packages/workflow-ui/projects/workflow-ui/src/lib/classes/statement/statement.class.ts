import {ElementNames, NUMBER} from '../../enum';
import {RecordOfAnyType, StateMap, WorkflowNode} from '../../types/base.types';
import {WorkflowElement} from '../element/abstract-element.class';
import {StatementNode} from './statement-node.class';

export class Statement<E, S = RecordOfAnyType> {
  head: StatementNode<E>[] = [];
  tail: StatementNode<E>[] = [];
  state: StateMap<S>;

  /**
   * The constructor function takes a state object as an argument and assigns it to the state property
   * of the class
   * @param state - StateMap<S>
   */
  constructor(state: StateMap<S>) {
    this.state = state;
  }

  /* A getter and setter for the processId. */
  private _processId: string;
  set processId(id: string) {
    this._processId = id;
  }
  get processId() {
    return this._processId;
  }

  /**
   * If the list is empty, set the head and tail to the new node. Otherwise, set the new node's next to
   * the head, set the head's prev to the new node, and set the head to the new node
   * @param element - WorkflowElement<E>
   * @returns A new node
   */
  addStart(element: WorkflowElement<E>) {
    const newNode = new StatementNode<E>(element);
    if (this.head.length > 0) {
      newNode.next = this.head;
      this.head[0].prev = [newNode];
      this.head = [newNode];
    } else {
      this.head = this.tail = [newNode];
    }
    return newNode;
  }

  /**
   * If the tail is not empty, then set the last element of the tail to point to the new node, and set
   * the new node to point to the tail. Otherwise, set the head and tail to the new node
   * @param element - WorkflowElement<E>
   * @returns A new node
   */
  addEnd(element: WorkflowElement<E>) {
    const newNode = new StatementNode<E>(element);
    if (this.tail.length > 0) {
      this.tail[this.tail.length - 1].next = [newNode];
      newNode.prev = this.tail;
      this.tail = [newNode];
    } else {
      this.tail = this.head = [newNode];
    }
    return newNode;
  }

  /**
   * > The function adds a new node to the end of the linked list
   * @param element - WorkflowElement<E> - the element that is being added to the workflow
   * @param node - WorkflowNode<E> - the node that is being added to the workflow
   * @returns A new node is being returned.
   */
  addNode(element: WorkflowElement<E>, node: WorkflowNode<E>) {
    const newNode = new StatementNode<E>(element, node);
    if (this.head.length > 0) {
      newNode.prev = this.tail;
      for (const element of this.tail) {
        if (
          element.element.name !== ElementNames.readColumnValue ||
          this.tail.length < NUMBER.TWO
        ) {
          this.prepareNextNode(element, newNode);
        }
      }
      this.tail = [newNode];
    } else {
      this.head = this.tail = [newNode];
    }
    return newNode;
  }

  /**
   * It takes an array of StatementNodes and a gateway node, and adds the StatementNodes to the end of
   * the linked list
   * @param {StatementNode<E>[]} statementNodes - An array of StatementNode objects.
   * @param gateway - StatementNode<E>
   * @returns The statementNodes array is being returned.
   */
  addNodes(statementNodes: StatementNode<E>[], gateway: StatementNode<E>) {
    if (this.head.length > 0) {
      for (let i = 0; i < statementNodes.length; i++) {
        switch (statementNodes[i].element.name) {
          case ElementNames.readColumnValue:
            statementNodes[i].prev = this.tail;
            statementNodes[i].next = [statementNodes[i + 1]];
            break;
          case ElementNames.gateway:
            statementNodes[i].prev = [statementNodes[i - 1]];
            statementNodes[i].next = [gateway];
            break;
        }
      }
      gateway.prev = statementNodes.filter(
        node => node.element.name === ElementNames.gateway,
      );

      for (const element of this.tail) {
        element.next = statementNodes.filter(
          node => node.element.name === ElementNames.readColumnValue,
        );
      }
      this.tail = [gateway];
    }
    return statementNodes;
  }

  /**
   * "We're going to loop through each node in the linked list, and for each node, we're going to loop
   * through each element in the node, and for each element, we're going to push it into an array."
   *
   * The first thing we do is create a variable called current and set it equal to this.head. This is
   * the first node in the linked list
   * @returns An array of StatementNode<E>
   */
  toBaseArray() {
    let current = this.head;
    const out: StatementNode<E>[] = [];
    while (current) {
      current.forEach(node => {
        out.push(node);
      });
      current = current[current.length - 1].next;
    }
    return out;
  }

  /**
   * If the next property of the element is defined, push the new node into it, otherwise set the next
   * property to an array containing the new node.
   * @param element - The element that we are currently on.
   * @param newNode - The new node to be added to the tree.
   */
  prepareNextNode(element: StatementNode<E>, newNode: StatementNode<E>) {
    if (element.next) {
      element.next.push(newNode);
    } else {
      element.next = [newNode];
    }
  }
}
