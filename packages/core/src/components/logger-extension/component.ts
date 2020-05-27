import {Component, ProviderMap} from '@loopback/core';
import {LOGGER} from './keys';
import {LoggerProvider} from './providers/logger.provider';

export class LoggerExtensionComponent implements Component {
  constructor() {}

  providers?: ProviderMap = {[LOGGER.BINDINGS.LOG_ACTION.key]: LoggerProvider};
}
