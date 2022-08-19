export class StateNode<R> {
  private readonly map: R;
  private _next?: StateNode<R>;
  private _prev?: StateNode<R>;
  constructor(current: R) {
    this.map = current;
  }
  get state() {
    return this.map;
  }
  get next() {
    return this._next;
  }
  set next(next: StateNode<R> | undefined) {
    this._next = next;
  }
  get prev() {
    return this._prev;
  }
  set prev(prev: StateNode<R> | undefined) {
    this._prev = prev;
  }
}
