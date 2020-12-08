import {createLogger, transports, format} from 'winston';
import {LOGGER} from '../keys';
import {WinstonLoggerBase} from './logger-base';
import {TransformableInfo} from 'logform';

interface LogEntry extends TransformableInfo {
  level: string;
  message: string;
  timestamp?: Date;
}

export class WinstonConsoleLogger extends WinstonLoggerBase {
  constructor() {
    super();
    const logFormat = format.combine(
      format.uncolorize(),
      format.timestamp(),
      format.printf(
        (log: LogEntry) => `[${log.timestamp}] ${log.level} :: ${log.message}`,
      ),
    );

    this.logger = createLogger({
      transports: [new transports.Console()],
      format: logFormat,
      level:
        process.env.LOG_LEVEL ??
        LOGGER.LOG_LEVEL[LOGGER.LOG_LEVEL.ERROR].toLowerCase(),
    });
  }
}
