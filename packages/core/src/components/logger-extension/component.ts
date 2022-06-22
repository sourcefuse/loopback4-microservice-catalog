import {Component, ProviderMap} from '@loopback/core';
import {LOGGER} from './keys';
import {LoggerProvider} from './providers/logger.provider';

export class LoggerExtensionComponent implements Component {
  providers: ProviderMap = {};
  constructor() {
    this.providers = {[LOGGER.BINDINGS.LOG_ACTION.key]: LoggerProvider};
  }
}
