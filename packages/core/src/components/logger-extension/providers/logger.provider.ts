﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Provider} from '@loopback/core';
import {ILogger} from '../logger.interface';
import {WinstonConsoleLogger} from '../winston/logger-console';

export class LoggerProvider implements Provider<ILogger> {
  constructor() {
    this.logger = new WinstonConsoleLogger();
  }

  logger: ILogger;
  // Provider interface
  value() {
    return this.logger;
  }
}
