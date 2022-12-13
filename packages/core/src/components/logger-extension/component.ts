// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Component, ProviderMap} from '@loopback/core';
import {LOGGER} from './keys';
import {LoggerProvider} from './providers/logger.provider';

/**
 * `LoggerExtensionComponent` class - a component that provides a `LoggerProvider`.
 */
export class LoggerExtensionComponent implements Component {
  providers: ProviderMap = {};
  /**
   * Creating a new instance of the LoggerProvider class and assigning it to the LOG_ACTION key.
   */
  constructor() {
    this.providers = {[LOGGER.BINDINGS.LOG_ACTION.key]: LoggerProvider};
  }
}
