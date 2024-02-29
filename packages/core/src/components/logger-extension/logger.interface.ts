// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {LogMessage} from './types';

export interface ILogger {
  log(info: LogMessage): void;
  info(msg: string, key?: string, context?: AnyObject): void;
  warn(msg: string, key?: string, context?: AnyObject): void;
  error(msg: string, key?: string, context?: AnyObject): void;
  debug(msg: string, key?: string, context?: AnyObject): void;
}
