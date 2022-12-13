// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {LogMessage} from './types';

/**
 * Exporting interface `ILogger`,with specified types log,info,warn,error,debug.
 */
export interface ILogger {
  /**
   * Defining the interface for the logger.
   *
   * @param info - info message with key returned in string type
   * @param warn - warn message with key returned in string type
   * @param error - error message with key returned in string type
   * @param message - debug message with key returned in string type
   */
  log(info: LogMessage): void;
  info(msg: string, key?: string): void;
  warn(msg: string, key?: string): void;
  error(msg: string, key?: string): void;
  debug(msg: string, key?: string): void;
}
