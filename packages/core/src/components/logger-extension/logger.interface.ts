// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {STATUS_CODE} from '../../enums';
import {LogMessage} from './types';

export interface ILogger {
  log(info: LogMessage): void;
  info(
    msg: string,
    context?: string,
    statusCode?: STATUS_CODE,
    key?: string,
  ): void;
  warn(
    msg: string,
    context?: string,
    statusCode?: STATUS_CODE,
    key?: string,
  ): void;
  error(
    msg: string,
    context?: string,
    statusCode?: STATUS_CODE,
    key?: string,
  ): void;
  debug(
    msg: string,
    context?: string,
    statusCode?: STATUS_CODE,
    key?: string,
  ): void;
}
