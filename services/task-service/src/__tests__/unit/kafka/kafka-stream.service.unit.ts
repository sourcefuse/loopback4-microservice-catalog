import {sinon} from '@loopback/testlab';
import {Kafka} from 'kafkajs';
import {KafkaEventAdapter, KafkaStreamService} from '../../../connectors/kafka';
import {IEvent} from '../../../interfaces';
import {mockLogger} from '../../fixtures/test-helper';

describe('KafkaStreamStream', () => {
  let service: KafkaStreamService<IEvent>;
  let sandbox: sinon.SinonSandbox;
  let consumerStubs: {
    connect: sinon.SinonStub;
    subscribe: sinon.SinonStub;
    run: sinon.SinonStub;
    disconnect: sinon.SinonStub;
    on: sinon.SinonStub;
  };
  let producerStubs: {
    connect: sinon.SinonStub;
    disconnect: sinon.SinonStub;
    send: sinon.SinonStub;
  };

  let kafkaConstructor: typeof Kafka;

  before(() => {
    sandbox = sinon.createSandbox();
    consumerStubs = {
      connect: sandbox.stub(),
      subscribe: sandbox.stub(),
      run: sandbox.stub(),
      disconnect: sandbox.stub(),
      on: sandbox.stub(),
    };
    producerStubs = {
      connect: sandbox.stub(),
      disconnect: sandbox.stub(),
      send: sandbox.stub(),
    };
    class MockKafka {
      consumer() {
        return {
          connect: consumerStubs.connect,
          subscribe: consumerStubs.subscribe,
          run: consumerStubs.run,
          disconnect: consumerStubs.disconnect,
          on: consumerStubs.on,
        };
      }
      producer() {
        return {
          connect: producerStubs.connect,
          disconnect: producerStubs.disconnect,
          send: producerStubs.send,
        };
      }
    }
    kafkaConstructor = MockKafka as unknown as typeof Kafka;
  });

  beforeEach(() => {
    sandbox.reset();
    service = new KafkaStreamService(
      {
        connection: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'test',
        },
        producer: {},
        topics: ['test'],
        output: {
          topic: 'test',
        },
      },
      new KafkaEventAdapter(),
      mockLogger(sandbox),
      kafkaConstructor,
    );
  });

  it('should should add a handler for a kafka topic', async () => {
    const handler = sandbox.stub();
    await service.subscribe(handler);
    sinon.assert.calledOnce(consumerStubs.connect);
    sinon.assert.calledOnce(consumerStubs.subscribe);
    sinon.assert.calledOnce(consumerStubs.run);
  });

  it('should publish an event to a kafka topic', async () => {
    const event = {
      key: 'test',
      payload: {
        test: 'test',
      },
      timestamp: Date.now(),
      source: 'test',
    };
    await service.publish(event);
    sinon.assert.calledOnce(producerStubs.connect);
    sinon.assert.calledOnce(producerStubs.send);
    sinon.assert.calledOnce(producerStubs.disconnect);
  });
});
