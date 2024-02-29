// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {Logger as WinstonLogger} from 'winston';
import {LOGGER} from '../keys';
import {ILogger} from '../logger.interface';
import {LogMessage} from '../types';

export class WinstonLoggerBase implements ILogger {
  logger: WinstonLogger;

  log(info: LogMessage): void {
    switch (Number(info.level)) {
      case LOGGER.LOG_LEVEL.INFO:
        this.info(info.message, info.key, info.context);
        break;
      case LOGGER.LOG_LEVEL.WARN:
        this.warn(info.message, info.key, info.context);
        break;
      case LOGGER.LOG_LEVEL.ERROR:
        this.error(info.message, info.key, info.context);
        break;
      case LOGGER.LOG_LEVEL.DEBUG:
        this.debug(info.message, info.key);
        break;
    }
  }
  info(message: string, key = 'App_Log', context?: AnyObject): void {
    this.logger.info(`${key} -> ${message}`);
  }
  warn(message: string, key = 'App_Log', context?: AnyObject): void {
    this.logger.warn(`${key} -> ${message}`);
  }
  error(message: string, key = 'App_Log', context?: AnyObject): void {
    this.logger.error(`${key} -> ${message}`);
  }
  debug(message: string, key = 'App_Log', context?: AnyObject): void {
    this.logger.debug(`${key} -> ${message}`);
  }
}
