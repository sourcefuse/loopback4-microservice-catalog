import { RecordOfAnyType, StateMap, WorkflowNode } from '../../types/base.types';
import { WorkflowElement } from '../element/abstract-element.class';
import { StatementNode } from './statement-node.class';

export class Statement<E, S = RecordOfAnyType> {
  head: StatementNode<E>[];
  tail: StatementNode<E>[];
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
    if (this.head) {
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
    if (this.tail) {
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
    if (this.head) {
      const lastEvent = this.tail[this.tail.length - 1];
      // newNode.next = lastEvent.next;
      newNode.prev = this.tail;
      // if (lastEvent.next) {
      //   lastEvent.next[lastEvent.next.length - 1].next = [newNode];
      // }
      lastEvent.next = [newNode];
      this.tail = [newNode];
    } else {
      this.head = this.tail = [newNode];
    }
    return newNode;
  }

  addNodes(statementNodes: StatementNode<E>[]) {
    if (this.head) {
      const lastEvent = this.tail[this.tail.length - 1];
      statementNodes[0].prev = this.tail;
      // if (lastEvent.next) {
      //   lastEvent.next[lastEvent.next.length - 1].next = statementNodes;
      // }
      lastEvent.next = statementNodes;
      this.tail = statementNodes;
    }
    else {
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
}
