import {AnyObject} from '@loopback/repository';
import {sinon} from '@loopback/testlab';
import {ILogger} from '@sourceloop/core';
export const logger: ILogger = {
  log: (info: AnyObject) => sinon.stub(),
  info: (msg: string, key?: string) => sinon.stub(),
  warn: (msg: string, key?: string) => sinon.stub(),
  error: (msg: string, key?: string) => sinon.stub(),
  debug: (msg: string, key?: string) => sinon.stub(),
};

export const flushPromises = (): Promise<void> =>
  new Promise(resolve => setImmediate(resolve));

export function setupEnv() {
  process.env.HOST = 'localhost';
  process.env.PORT = '4200';
}
