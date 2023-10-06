import {FilterStrategy} from '../types';

export class FilterContext {
  private strategy: FilterStrategy;

  setStrategy(strategy: FilterStrategy) {
    this.strategy = strategy;
  }

  filter(data: string[], filterValues: string[]): string[] {
    return this.strategy.applyFilter(data, filterValues);
  }
}
