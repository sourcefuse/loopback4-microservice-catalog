import {ILogger} from '@sourceloop/core';
import {LogMessage} from '@sourceloop/core/dist/components/logger-extension/types';

export class Logger implements ILogger {
  log(info: LogMessage): void {
    // Implement the log method
    // ...
  }

  info(msg: string, key?: string): void {
    // Implement the info method
    // ...
  }

  warn(msg: string, key?: string): void {
    // Implement the warn method
    // ...
  }

  error(msg: string, key?: string): void {
    // Implement the error method
    // ...
  }

  debug(msg: string, key?: string): void {
    // Implement the debug method
    // ...
  }
}
