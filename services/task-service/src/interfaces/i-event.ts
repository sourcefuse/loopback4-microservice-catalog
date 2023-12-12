// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IEvent<T = any> {
  type: string;
  payload: T;
  timestamp: number;
  source: string;
}
