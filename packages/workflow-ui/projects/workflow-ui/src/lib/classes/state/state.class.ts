import {StateNode} from './state-node.class';
import {AllowedValues, RecordOfAnyType} from '../../types';

export class State<E extends RecordOfAnyType> {
  private state = new Map<keyof E, AllowedValues>();
  private current: StateNode<E>;
  constructor() {
    this.current = new StateNode({} as E);
  }
  change(key: keyof E, value: AllowedValues) {
    this.state.set(key, value);
    this.addSnapshot();
  }

  remove(key: keyof E) {
    this.state.delete(key);
    this.addSnapshot();
  }

  restore(map: {[key in keyof E]: AllowedValues}) {
    if (map) {
      this.state = new Map(Object.entries(map));
      this.addSnapshot();
    }
  }

  undo(): void {
    if (this.current.prev) {
      this.current = this.current.prev;
    }
  }

  redo(): void {
    if (this.current.next) {
      this.current = this.current.next;
    }
  }

  get(key: keyof E) {
    return this.current.state[key];
  }

  getAll(keys?: (keyof E)[]) {
    return this.mapToObject(this.state, keys);
  }

  private addSnapshot() {
    const newState = new StateNode<E>(this.mapToObject(this.state));
    if (this.current) {
      this.current.next = newState;
      newState.prev = this.current;
      this.current = newState;
    } else {
      this.current = newState;
    }
  }

  private mapToObject(map: Map<keyof E, AllowedValues>, keys?: (keyof E)[]) {
    if (!keys) {
      return Object.assign(
        {},
        ...[...map.entries()].map(([k, v]) => ({[k]: v})),
      );
    } else {
      return Object.assign(
        {},
        ...[...map.entries()]
          .filter(([k, v]) => keys.includes(k))
          .map(([k, v]) => ({[k]: v})),
      );
    }
  }
}
