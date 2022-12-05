// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Logger as WinstonLogger} from 'winston';
import {ILogger} from '../logger.interface';
import {LogMessage} from '../types';
import {LOGGER} from '../keys';

/**
 * @param {WinstonLoggerBase} WinstonLoggerBase class implements the `ILogger` interface and has a logger property of type WinstonLogger
 *  */
export class WinstonLoggerBase implements ILogger {
  logger: WinstonLogger;

  /**
   *  A switch case statement.
   */
  log(info: LogMessage): void {
    switch (Number(info.level)) {
      case LOGGER.LOG_LEVEL.INFO:
        this.info(info.message, info.key);
        break;
      case LOGGER.LOG_LEVEL.WARN:
        this.warn(info.message, info.key);
        break;
      case LOGGER.LOG_LEVEL.ERROR:
        this.error(info.message, info.key);
        break;
      case LOGGER.LOG_LEVEL.DEBUG:
        this.debug(info.message, info.key);
        break;
    }
  }
  /**
   * @param {info} info function takes two parameters, message and key.The default value of key is 'App_Log'.
   * @param {warn} warn function takes two parameters, message and key.The default value of key is 'App_Log'.
   * @param {error} error function takes two parameters, message and key.The default value of key is 'App_Log'.
   * @param {debug} debug function takes two parameters, message and key.The default value of key is 'App_Log'.
   * */
  info(message: string, key = 'App_Log'): void {
    this.logger.info(`${key} -> ${message}`);
  }
  warn(message: string, key = 'App_Log'): void {
    this.logger.warn(`${key} -> ${message}`);
  }
  error(message: string, key = 'App_Log'): void {
    this.logger.error(`${key} -> ${message}`);
  }
  debug(message: string, key = 'App_Log'): void {
    this.logger.debug(`${key} -> ${message}`);
  }
}
