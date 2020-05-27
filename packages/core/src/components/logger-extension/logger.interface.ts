import {LogMessage} from './types';

export interface ILogger {
  log(info: LogMessage): void;
  info(msg: string, key?: string): void;
  warn(msg: string, key?: string): void;
  error(msg: string, key?: string): void;
  debug(msg: string, key?: string): void;
}
