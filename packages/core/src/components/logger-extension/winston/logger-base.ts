// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Logger as WinstonLogger} from 'winston';
import {ILogger} from '../logger.interface';
import {LogMessage} from '../types';
import {LOGGER} from '../keys';

/**
 * `WinstonLoggerBase` class implements the `ILogger` interface and has a logger property of type WinstonLogger.
 */
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
   * Logs the error using winston
   * @param message - Info message to log
   * @param message - Warn message to log
   * @param message - Error message to log
   * @param message - Debug message to log
   * @param key (optional) - Key to prefix message with. Defaults to `App_Log`
   */
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
