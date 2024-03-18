export interface IEventAdapter<T, Event, R = Event> {
  adaptTo(event: T): Promise<Event>;
  adaptFrom(event: Event): Promise<R>;
}
