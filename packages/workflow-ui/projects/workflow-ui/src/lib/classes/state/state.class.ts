import {StateNode} from './state-node.class';
import {AllowedValues, RecordOfAnyType} from '../../types';

export class State<E extends RecordOfAnyType> {
  private state = new Map<keyof E, AllowedValues>();
  private current: StateNode<E>;

  /**
   * The constructor function creates a new StateNode object and assigns it to the current property of
   * the StateMachine object
   */
  constructor() {
    this.current = new StateNode({} as E);
  }

  /**
   * Change takes a key of type keyof E and a value of type AllowedValues and sets the key to the value
   * in the state map.
   * @param key - keyof E
   * @param {AllowedValues} value - The value of the input field.
   */
  change(key: keyof E, value: AllowedValues) {
    this.state.set(key, value);
    this.addSnapshot();
  }

  /**
   * It removes the key from the state and adds a snapshot
   * @param key - keyof E
   */
  remove(key: keyof E) {
    this.state.delete(key);
    this.addSnapshot();
  }

  /**
   * It takes an object whose keys are the same as the keys of the enum E, and whose values are the
   * same as the values of the enum AllowedValues, and it sets the state of the store to a map whose
   * keys are the same as the keys of the enum E, and whose values are the same as the values of the
   * enum AllowedValues
   * @param map - {[key in keyof E]: AllowedValues}
   */
  restore(map: {[key in keyof E]: AllowedValues}) {
    if (map) {
      this.state = new Map(Object.entries(map));
      this.addSnapshot();
    }
  }

  /**
   * If the current node has a previous node, then set the current node to the previous node
   */
  undo(): void {
    if (this.current.prev) {
      this.current = this.current.prev;
    }
  }

  /**
   * If the current node has a next node, then set the current node to the next node
   */
  redo(): void {
    if (this.current.next) {
      this.current = this.current.next;
    }
  }

  /**
   * "Get the value of the property with the given key from the current state."
   *
   * The keyof E is a TypeScript keyword that means "the keys of the type E."
   *
   * The keyof E is a TypeScript keyword that means "the keys
   * @param key - keyof E
   * @returns The value of the key in the current state.
   */
  get(key: keyof E) {
    return this.current.state[key];
  }

  /**
   * It takes an array of keys, and returns an object with those keys and their values from the state
   * @param {(keyof E)[]} [keys] - (keyof E)[]
   * @returns An object with the keys and values of the state.
   */
  getAll(keys?: (keyof E)[]) {
    return this.mapToObject(this.state, keys);
  }

  /**
   * It creates a new StateNode object, sets the current node's next property to the new node, sets the
   * new node's prev property to the current node, and then sets the current node to the new node
   */
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

  /**
   * It takes a Map and an optional array of keys, and returns an object with the same keys and values
   * as the Map
   * @param map - Map<keyof E, AllowedValues>
   * @param {(keyof E)[]} [keys] - (keyof E)[]
   * @returns An object with the keys and values of the map.
   */
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
