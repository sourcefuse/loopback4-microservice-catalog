import {BindingKey, LifeCycleObserver} from '@loopback/core';

const BINDING_PREFIX = 'Scheduler';

export namespace SchedulerBindings {
  export const dbConnector = BindingKey.create<LifeCycleObserver>(
    `${BINDING_PREFIX}.db`,
  );
}
