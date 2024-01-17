export interface IOutgoingConnector<T> {
  publish(event: T): Promise<void>;
}
