import {Logger as WinstonLogger} from 'winston';
import {ILogger} from '../logger.interface';
import {LogMessage} from '../types';
import {LOGGER} from '../keys';

export class WinstonLoggerBase implements ILogger {
  constructor() {}

  logger: WinstonLogger;

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
