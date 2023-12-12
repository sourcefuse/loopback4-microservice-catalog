export interface IEventAdapter<T, S> {
  adaptTo(event: T): Promise<S>;
}
