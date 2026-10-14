// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {load} from '../../../scenario/builder';
import {
  isParallel,
  isRaw,
  isRequest,
  isTemplate,
  isValue,
  requestsIn,
} from '../../../scenario/guards';
import {template, token, uuid} from '../../../scenario/values';

describe('parallel groups in guards', () => {
  it('requestsIn flattens a group in order, also inside a loop', () => {
    const [a, b, c, d] = ['/a', '/b', '/c', '/d'].map(path => load.get(path));

    const flow = [
      a,
      load.parallel([b, c]),
      load.step({loop: [load.parallel([d])]}),
    ];

    expect(requestsIn(flow)).to.deepEqual([a, b, c, d]);
  });

  it('isParallel is true only for a group', () => {
    expect(isParallel(load.parallel([load.get('/a')]))).to.be.true();
    expect(isParallel(load.get('/a'))).to.be.false();
    expect(isParallel(null)).to.be.false();
  });
});

describe('guards and plain objects', () => {
  it('take the objects of the library, and no plain object with the same shape', () => {
    expect(isValue(uuid())).to.be.true();
    expect(isValue(token())).to.be.true();
    expect(isTemplate(template`a-${uuid()}`)).to.be.true();
    expect(isRequest(load.get('/a'))).to.be.true();
    expect(isRaw(load.step({think: 1}))).to.be.true();

    expect(isValue({kind: 'uuid', n: 1})).to.be.false();
    expect(isValue({kind: 'token'})).to.be.false();
    expect(isTemplate({kind: 'template', name: 'welcome'})).to.be.false();
    expect(isRequest({kind: 'request', id: 'GET /a'})).to.be.false();
    expect(isRaw({kind: 'raw', step: {}})).to.be.false();
    expect(isParallel({kind: 'parallel', requests: []})).to.be.false();
  });

  it('do not take a copy of a value', () => {
    expect(isValue({...uuid()})).to.be.false();
  });
});
