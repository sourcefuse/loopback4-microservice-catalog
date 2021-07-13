import {BindingKey} from '@loopback/core';
import {ISchedulerConfig} from './types';

export namespace SchedulerBindings {
  export const Config = BindingKey.create<ISchedulerConfig | null>(
    'sf.scheduler.config',
  );
}

export const SchedulerDatasourceName = 'schedulerDb';
