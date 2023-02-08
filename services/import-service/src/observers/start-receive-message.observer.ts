import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {ImportServiceBindings} from '../keys';

@lifeCycleObserver('ImportService')
export class ReceiveMessageListenerObserver implements LifeCycleObserver {
  constructor(
    @inject(ImportServiceBindings.ReceiveMessageListenerProvider)
    private receiveMessageListenerFn: () => void,
  ) {}

  start() {
    this.receiveMessageListenerFn();
  }
}
