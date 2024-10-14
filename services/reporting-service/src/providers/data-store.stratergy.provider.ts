import {Context, inject, Provider} from '@loopback/core';
import {DataStoreAdapter} from '../interfaces';
import {ReportingServiceComponentBindings} from '../keys';

/* The `DataStoreStrategyProvider` class is a provider that retrieves a `DataStoreAdapter` based on a
strategy key and the current context. */
export class DataStoreStrategyProvider implements Provider<DataStoreAdapter> {
  constructor(
    @inject(ReportingServiceComponentBindings.DATA_STORE_ADAPTER)
    private readonly strategyKey: string,
    @inject.context() private readonly ctx: Context,
  ) {}

  async value(): Promise<DataStoreAdapter> {
    const binding = this.ctx.getBinding(this.strategyKey);
    return binding.getValue(this.ctx);
  }
}
