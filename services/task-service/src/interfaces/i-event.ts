// sonarignore:start
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IEvent<T = any> {
  // sonarignore:end
  key: string;
  payload: T;
  timestamp: number;
  source: string;
}
