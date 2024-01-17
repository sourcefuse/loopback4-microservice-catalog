import {expect} from '@loopback/testlab';
import {KafkaEventAdapter} from '../../../connectors/kafka';
import {IEvent} from '../../../interfaces';

describe('KafkaAdapterService', () => {
  let adapter: KafkaEventAdapter<IEvent>;
  const testTopic = 'test-topic';

  beforeEach(() => {
    adapter = new KafkaEventAdapter();
  });

  it('should adapt to an event', async () => {
    const event = {
      data: 'test',
    };
    const result = await adapter.adaptTo({
      topic: testTopic,
      message: {
        timestamp: '123',
        value: Buffer.from(JSON.stringify(event)),
        key: Buffer.from(JSON.stringify('test-key')),
        attributes: 0,
        offset: '123',
        headers: {},
      },
      partition: 0,
      heartbeat: async () => {},
      pause: () => () => {},
    });
    expect(result).to.be.eql({
      key: testTopic,
      timestamp: 123,
      source: 'kafka',
      payload: event,
    });
  });

  it('should adapt from an event', async () => {
    const event = {
      key: testTopic,
      timestamp: 123,
      source: 'kafka',
      payload: {
        data: 'test',
      },
    };
    const result = await adapter.adaptFrom(event);
    expect(result).to.be.eql(event);
  });
});
