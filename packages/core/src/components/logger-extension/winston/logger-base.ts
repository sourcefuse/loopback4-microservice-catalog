// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Logger as WinstonLogger} from 'winston';
import {STATUS_CODE} from '../../../enums';
import {LOGGER} from '../keys';
import {ILogger} from '../logger.interface';
import {LogMessage} from '../types';

export class WinstonLoggerBase implements ILogger {
  logger: WinstonLogger;

  log(info: LogMessage): void {
    switch (Number(info.level)) {
      case LOGGER.LOG_LEVEL.INFO:
        this.info(info.message, info.context, info.statusCode, info.key);
        break;
      case LOGGER.LOG_LEVEL.WARN:
        this.warn(info.message, info.context, info.statusCode, info.key);
        break;
      case LOGGER.LOG_LEVEL.ERROR:
        this.error(info.message, info.context, info.statusCode, info.key);
        break;
      case LOGGER.LOG_LEVEL.DEBUG:
        this.debug(info.message, info.context, info.statusCode, info.key);
        break;
    }
  }
  info(
    message: string,
    context?: string,
    statusCode?: STATUS_CODE,
    key = 'App_Log',
  ): void {
    this.logger.info({
      message: `${message}`,
      context: context,
      statusCode: statusCode,
      key: key,
    });
  }
  warn(
    message: string,
    context?: string,
    statusCode?: STATUS_CODE,
    key = 'App_Log',
  ): void {
    this.logger.warn({
      message: `${message}`,
      context: context,
      statusCode: statusCode,
      key: key,
    });
  }
  error(
    message: string,
    context?: string,
    statusCode?: STATUS_CODE,
    key = 'App_Log',
  ): void {
    this.logger.error({
      message: `${message}`,
      context: context,
      statusCode: statusCode,
      key: key,
    });
  }
  debug(
    message: string,
    context?: string,
    statusCode?: STATUS_CODE,
    key = 'App_Log',
  ): void {
    this.logger.debug({
      message: `${message}`,
      context: context,
      statusCode: statusCode,
      key: key,
    });
  }
}
