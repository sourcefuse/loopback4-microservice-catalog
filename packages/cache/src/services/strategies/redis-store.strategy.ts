import {BindingScope, Context, inject, injectable} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {CacheComponentBindings} from '../../keys';
import {ICacheComponentOptions, ICacheStore} from '../../types';

@injectable({
  scope: BindingScope.SINGLETON,
})
export class RedisStoreStrategy implements ICacheStore {
  public datasource: juggler.DataSource;
  private readonly decoder = new TextDecoder('utf-8');
  constructor(
    @inject(CacheComponentBindings.CacheConfig)
    private readonly configuration: ICacheComponentOptions,
    @inject.context()
    private readonly context: Context,
  ) {
    if (!configuration.datasourceName) {
      throw new Error('Datasource name is required for redis caching strategy');
    }
    this.datasource = context.getSync<juggler.DataSource>(
      `datasources.${configuration.datasourceName}`,
    );
    if (!this.datasource.connector?.execute) {
      throw new Error('Redis connector not found');
    }
  }
  get<T>(key: string): Promise<T | undefined> {
    return this.executeCommand('GET', [key]);
  }
  getMany<T>(keys: string[]): Promise<(T | undefined)[]> {
    return this.executeCommand('MGET', keys);
  }
  set<T>(key: string, value: T, ttl: number): Promise<void> {
    return this.executeCommand('SET', [key, JSON.stringify(value), 'PX', ttl]);
  }
  setMany<T>(keys: [string, T, number][]): Promise<void> {
    const args = keys.reduce(
      (acc, [key, value, ttl]) => {
        acc.push(key, JSON.stringify(value), 'PX', ttl);
        return acc;
      },
      [] as (string | number)[],
    );
    return this.executeCommand('MSET', args);
  }

  delete(key: string): Promise<void> {
    return this.executeCommand('DEL', [key]);
  }

  deleteMany(keys: string[]): Promise<void> {
    return this.executeCommand('DEL', keys);
  }

  executeCommand<S>(command: string, args: (string | number)[]): Promise<S> {
    return new Promise((resolve, reject) => {
      if (this.datasource.connector?.execute) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.datasource.connector.execute(
          command,
          args,
          (err: Error, res: Buffer) => {
            if (err) {
              reject(err);
            }
            resolve(this.parseValue<S>(res));
          },
        );
      }
    });
  }

  private parseValue<T>(res: Buffer | Array<Buffer>): T {
    if (!res) {
      return undefined as T;
    }
    if (Buffer.isBuffer(res)) {
      let value = this.decoder.decode(res);
      try {
        value = JSON.parse(value);
      } catch (e) {
        // do nothing
      }
      return value as T;
    } else if (typeof res === 'number') {
      return res as unknown as T;
    } else {
      return res.map(value => {
        if (!value) {
          return undefined;
        }
        let decoded = this.decoder.decode(value);
        try {
          decoded = JSON.parse(decoded);
        } catch (e) {
          // do nothing
        }
        return decoded;
      }) as T;
    }
  }
}
