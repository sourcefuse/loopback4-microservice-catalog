// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingKey} from '@loopback/core';
import {IServiceConfig} from '@sourceloop/core';
import {ISchedulerConfig} from './types';

export namespace SchedulerBindings {
  export const Config = BindingKey.create<ISchedulerConfig | null>(
    'sf.scheduler.config',
  );
}
export namespace CoreSchedulerBindings {
  export const Config = BindingKey.create<IServiceConfig | null>(
    'sf.core.sequelize.config',
  );
}

export const SchedulerDatasourceName = 'schedulerDb';
