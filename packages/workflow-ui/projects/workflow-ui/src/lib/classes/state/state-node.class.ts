export class StateNode<R> {
  private readonly map: R;
  private _next?: StateNode<R>;
  private _prev?: StateNode<R>;

  /**
   * The constructor function takes a single argument, current, which is of type R. The constructor
   * function then sets the map property of the class to the value of the current argument.
   * @param {R} current - R
   */
  constructor(current: R) {
    this.map = current;
  }

  /**
   * It returns the value of the map property
   * @returns The map object.
   */
  get state() {
    return this.map;
  }

  /**
   * The function takes in a number, and returns a function that takes in a number, and returns a
   * number
   * @returns The next node in the linked list.
   */
  get next() {
    return this._next;
  }

  /**
   * The function takes a state node and sets it as the next state node
   * @param {StateNode<R> | undefined} next - The next node in the linked list.
   */
  set next(next: StateNode<R> | undefined) {
    this._next = next;
  }

  /**
   * If the value of the `prev` property is not `null`, then return the value of the `_prev` property,
   * otherwise return the value of the `next` property.
   * @returns The value of the _prev property.
   */
  get prev() {
    return this._prev;
  }

  /**
   * The function takes a StateNode and sets it as the previous state of the current state
   * @param {StateNode<R> | undefined} prev - The previous state node.
   */
  set prev(prev: StateNode<R> | undefined) {
    this._prev = prev;
  }
}
