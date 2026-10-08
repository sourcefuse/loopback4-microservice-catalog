import {BindingScope, injectable} from '@loopback/core';
import {ICacheStore} from '../../types';

@injectable({scope: BindingScope.SINGLETON})
export class InMemoryStoreStrategy implements ICacheStore {
  private readonly store = new Map<
    string,
    {
      cachedAt: number;
      ttl: number;
      // sonarignore:start
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any;
      // sonarignore:end
    }
  >();
  get<T>(key: string): Promise<T | undefined> {
    return Promise.resolve(this.getWithCheck(key));
  }
  getMany<T>(keys: string[]): Promise<(T | undefined)[]> {
    const valuePromises = keys.map(key => this.getWithCheck(key));
    return Promise.all(valuePromises);
  }
  set<T>(key: string, value: T, ttl: number): Promise<void> {
    this.setWithTime(key, value, ttl);
    return Promise.resolve();
  }
  setMany<T>(keys: [string, T, number][]): Promise<void> {
    keys.forEach(([key, value, ttl]) => this.setWithTime(key, value, ttl));
    return Promise.resolve();
  }

  delete(key: string): Promise<void> {
    this.store.delete(key);
    return Promise.resolve();
  }

  deleteMany(keys: string[]): Promise<void> {
    keys.forEach(key => this.store.delete(key));
    return Promise.resolve();
  }

  private getWithCheck(key: string) {
    const value = this.store.get(key);
    if (!value) {
      return undefined;
    }
    if (Date.now() > value.cachedAt + value.ttl) {
      return undefined;
    }
    return value.value;
  }

  private setWithTime(key: string, value: unknown, ttl: number) {
    this.store.set(key, {
      cachedAt: Date.now(),
      ttl,
      value,
    });
  }
}
