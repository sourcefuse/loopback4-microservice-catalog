import {ElementNames, NUMBER} from '../../enum';
import {RecordOfAnyType, StateMap, WorkflowNode} from '../../types/base.types';
import {WorkflowElement} from '../element/abstract-element.class';
import {StatementNode} from './statement-node.class';

export class Statement<E, S = RecordOfAnyType> {
  head: StatementNode<E>[] = [];
  tail: StatementNode<E>[] = [];
  state: StateMap<S>;
  constructor(state: StateMap<S>) {
    this.state = state;
  }
  private _processId: string;
  set processId(id: string) {
    this._processId = id;
  }
  get processId() {
    return this._processId;
  }
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

  addNodes(statementNodes: StatementNode<E>[]) {
    if (this.head.length > 0) {
      for (let i = 0; i < statementNodes.length; i++) {
        switch (statementNodes[i].element.name) {
          case ElementNames.readColumnValue:
            statementNodes[i].prev = this.tail;
            statementNodes[i].next = [statementNodes[i + 1]];
            break;
          case ElementNames.gateway:
            statementNodes[i].prev = [statementNodes[i - 1]];
            break;
        }
      }

      for (const element of this.tail) {
        if (element.element.name !== ElementNames.readColumnValue) {
          element.next = statementNodes.filter(
            node => node.element.name !== ElementNames.gateway,
          );
        }
      }
      this.tail = statementNodes.filter(
        node => node.element.name !== ElementNames.readColumnValue,
      );
    } else {
      this.head = this.tail = statementNodes;
    }
    return statementNodes;
  }

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

  prepareNextNode(element: StatementNode<E>, newNode: StatementNode<E>) {
    if (element.next) {
      element.next.push(newNode);
    } else {
      element.next = [newNode];
    }
  }
}
