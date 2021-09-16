import {inject, Provider} from '@loopback/core';
import {Unleash} from 'unleash-client'; //NOSONAR
import {UNLEASH_CONST} from '../keys';
import {FeatureInterface} from '../types';

export class SystemFeatureProvider implements Provider<FeatureInterface> {
  constructor(
    @inject(UNLEASH_CONST)
    private readonly unleashConst: Unleash,
  ) {}
  value(): FeatureInterface {
    return () => this.unleashConst.isEnabled('system-feature');
  }
}
