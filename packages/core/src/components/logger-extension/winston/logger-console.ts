// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {TransformableInfo} from 'logform';
import {createLogger, format, transports} from 'winston';
import {STATUS_CODE} from '../../../enums';
import {LOGGER} from '../keys';
import {WinstonLoggerBase} from './logger-base';

interface LogEntry extends TransformableInfo {
  level: string;
  message: string;
  timestamp?: Date;
  context?: string;
  statusCode?: STATUS_CODE;
}

export class WinstonConsoleLogger extends WinstonLoggerBase {
  constructor() {
    super();
    const logFormat = format.combine(
      format.uncolorize(),
      format.timestamp(),
      format.printf(
        (log: LogEntry) =>
          `[${log.timestamp}] ${log.level} :: ${log.context ?? '-'} :: ${
            log.key
          } -> [${log.statusCode ?? '-'}] ${log.message}`,
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
