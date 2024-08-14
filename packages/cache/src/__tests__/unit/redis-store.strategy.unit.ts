import {Context} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {RedisStoreStrategy} from '../../services';
import {expect, sinon} from '@loopback/testlab';
import {fail} from 'assert';
import {ICacheComponentOptions} from '../../types';

describe('RedisStoreStrategy: Unit', () => {
  let configuration: ICacheComponentOptions;
  let context: Context;
  let executor: sinon.SinonStub;
  let strategy: RedisStoreStrategy;
  beforeEach(() => {
    configuration = {
      datasourceName: 'cacheStore',
      strategy: RedisStoreStrategy,
    };
    context = new Context();
    executor = sinon.stub();
    context.bind('datasources.cacheStore').to({
      connector: {
        execute: executor,
      },
    });
    strategy = new RedisStoreStrategy(configuration, context);
  });
  afterEach(() => {
    executor.reset();
  });
  it('should throw error if datasource name is not provided', () => {
    const config = {
      datasourceName: '',
      strategy: RedisStoreStrategy,
    };
    expect(() => new RedisStoreStrategy(config, context)).to.throw(
      'Datasource name is required for redis caching strategy',
    );
  });
  it('should throw error if datasource is not found', () => {
    const dummyContext = new Context();
    try {
      new RedisStoreStrategy(configuration, dummyContext);
      fail();
    } catch (e) {
      expect(e.message).to.startWith(
        `The key 'datasources.cacheStore' is not bound to any value in context`,
      );
    }
  });
  it('should throw error if datasource connector is not found', () => {
    const dummyContext = new Context();
    dummyContext.bind('datasources.cacheStore').to(new juggler.DataSource());
    expect(() => new RedisStoreStrategy(configuration, dummyContext)).to.throw(
      'Redis connector not found',
    );
  });
  it('should throw an error if error received from redis', async () => {
    executor.yields(new Error('test'));
    try {
      await strategy.get('test');
      fail();
    } catch (e) {
      expect(e.message).to.equal('test');
    }
  });
  it('should execute get commmand', async () => {
    executor.yields(null, Buffer.from('{"name": "test"}'));
    const result = await strategy.get('test');
    expect(result).to.eql({name: 'test'});
    expect(executor.calledOnceWith('GET', ['test'])).to.be.true();
  });
  it('should execute get commmand returning undefined', async () => {
    executor.yields(null, null);
    const result = await strategy.get('test');
    expect(result).to.eql(undefined);
    expect(executor.calledOnceWith('GET', ['test'])).to.be.true();
  });
  it('should execute getMany commmand', async () => {
    executor.yields(null, [
      Buffer.from('[{"name": "test"}]'),
      Buffer.from('12341'),
    ]);
    const result = await strategy.getMany(['test', 'time']);
    expect(result).to.deepEqual([[{name: 'test'}], 12341]);
    expect(executor.calledOnceWith('MGET', ['test', 'time'])).to.be.true();
  });
  it('should execute getMany commmand with an undefined value', async () => {
    executor.yields(null, [Buffer.from('[{"name": "test"}]'), null]);
    const result = await strategy.getMany(['test', 'time']);
    expect(result).to.deepEqual([[{name: 'test'}], undefined]);
    expect(executor.calledOnceWith('MGET', ['test', 'time'])).to.be.true();
  });
  it('should execute set commmand', async () => {
    executor.yields(null, Buffer.from('{"name": "test"}'));
    const result = await strategy.set('test', {name: 'test'}, 1000);
    expect(result).to.eql({name: 'test'});
    expect(
      executor.calledOnceWith('SET', [
        'test',
        JSON.stringify({name: 'test'}),
        'PX',
        1000,
      ]),
    ).to.be.true();
  });
  it('should execute setMany commmand', async () => {
    executor.yields(null, Buffer.from('1'));
    const result = await strategy.setMany([
      ['test', 2000, 1000],
      ['time', 4000, 1000],
    ]);
    expect(result).to.eql(1);
    expect(
      executor.calledOnceWith('MSET', [
        'test',
        JSON.stringify(2000),
        'PX',
        1000,
        'time',
        JSON.stringify(4000),
        'PX',
        1000,
      ]),
    ).to.be.true();
  });
});
