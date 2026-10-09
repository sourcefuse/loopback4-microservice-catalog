// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {load, takeRegistered} from '../../../scenario/builder';

describe('load.describe and load.it', () => {
  beforeEach(() => {
    takeRegistered();
  });

  it('registers the scenarios in the order of the calls, and hands them over once', () => {
    load.it('first', [load.get('/a')]);
    load.it('second', [load.get('/b')]);

    expect(takeRegistered().map(s => s.name)).to.deepEqual(['first', 'second']);
    expect(takeRegistered()).to.deepEqual([]);
  });

  it('gives a scenario the names of the describes around it, outermost first', () => {
    load.describe('OrderController', () => {
      load.describe('reads', () => {
        load.it('lists orders', [load.get('/orders')]);
      });
      load.it('links an order', [load.get('/orders')]);
    });
    load.it('stands alone', [load.get('/orders')]);

    expect(takeRegistered().map(s => s.group)).to.deepEqual([
      ['OrderController', 'reads'],
      ['OrderController'],
      undefined,
    ]);
  });

  it('marks a scenario with only or skip, from itself or from a describe around it', () => {
    load.it.only('own only', []);
    load.it.skip('own skip', []);
    load.describe.only('block only', () => {
      load.it('inside', []);
    });
    load.describe.skip('block skip', () => {
      load.it('inside', []);
    });
    load.it('plain', []);

    expect(takeRegistered().map(({only, skip}) => ({only, skip}))).to.deepEqual(
      [
        {only: true, skip: undefined},
        {only: undefined, skip: true},
        {only: true, skip: undefined},
        {only: undefined, skip: true},
        {only: undefined, skip: undefined},
      ],
    );
  });

  it('returns the scenario that it registers', () => {
    const added = load.it('lists orders', [load.get('/orders')], {
      artillery: {config: {http: {timeout: 30}}},
    });

    expect(added).to.containEql({
      name: 'lists orders',
      artillery: {config: {http: {timeout: 30}}},
    });
    expect(takeRegistered()).to.deepEqual([added]);
  });

  it('rejects an async function, because it would register after the describe ended', () => {
    const define = (async () => undefined) as () => void;

    expect(() => load.describe('late', define)).to.throw(
      'load.describe("late"): the function cannot be async',
    );
  });

  it('closes a describe when its function throws', () => {
    expect(() =>
      load.describe('broken', () => {
        throw new Error('boom');
      }),
    ).to.throw('boom');

    load.it('after', []);

    expect(takeRegistered()[0].group).to.be.undefined();
  });

  describe('group options', () => {
    const only = () => {
      const [scenario] = takeRegistered();
      return scenario;
    };

    it('gives the options of a describe to the scenarios inside', () => {
      load.describe(
        'g',
        {
          headers: {a: '1'},
          phases: [{duration: 5, arrivalRate: 1}],
          thresholds: {p95: 100},
        },
        () => {
          load.it('s', []);
        },
      );

      expect(only()).to.containDeep({
        headers: {a: '1'},
        phases: [{duration: 5, arrivalRate: 1}],
        thresholds: {p95: 100},
        group: ['g'],
      });
    });

    it('still takes a describe with no options', () => {
      load.describe('g', () => {
        load.it('s', []);
      });

      const scenario = only();
      expect(scenario.group).to.deepEqual(['g']);
      expect(scenario).to.not.have.property('headers');
      expect(scenario).to.not.have.property('thresholds');
    });

    it('lets the inner describe beat the outer one, and it beat both', () => {
      load.describe(
        'outer',
        {headers: {a: 'outer', b: 'outer', c: 'outer'}},
        () => {
          load.describe('inner', {headers: {b: 'inner', c: 'inner'}}, () => {
            load.it('s', [], {headers: {c: 'it'}});
          });
        },
      );

      expect(only().headers).to.deepEqual({a: 'outer', b: 'inner', c: 'it'});
    });

    it('merges headers by name without case, and keeps the spelling of the winner', () => {
      load.describe('g', {headers: {Authorization: 'old', 'x-a': '1'}}, () => {
        load.it('s', [], {headers: {authorization: 'new'}});
      });

      expect(only().headers).to.deepEqual({'x-a': '1', authorization: 'new'});
    });

    it('replaces phases: the strongest layer that sets them wins', () => {
      const outer = [{duration: 1, arrivalRate: 1}];
      const inner = [{duration: 2, arrivalRate: 2}];
      const own = [{duration: 3, arrivalRate: 3}];
      load.describe('outer', {phases: outer}, () => {
        load.describe('inner', {phases: inner}, () => {
          load.it('inner wins', []);
          load.it('it wins', [], {phases: own});
        });
        load.it('outer only', []);
      });

      expect(takeRegistered().map(s => s.phases)).to.deepEqual([
        inner,
        own,
        outer,
      ]);
    });

    it('merges thresholds by field', () => {
      load.describe('outer', {thresholds: {p95: 100, errorRate: 5}}, () => {
        load.describe('inner', {thresholds: {p95: 200, minDelta: 3}}, () => {
          load.it('s', [], {thresholds: {minDelta: 9}});
        });
      });

      expect(only().thresholds).to.deepEqual({
        p95: 200,
        errorRate: 5,
        minDelta: 9,
      });
    });

    it('does not change the options object that the caller passed', () => {
      const options = {headers: {a: '1'}};
      load.describe('g', options, () => {
        load.it('s', [], {headers: {a: '2'}});
      });

      only();
      expect(options).to.deepEqual({headers: {a: '1'}});
    });

    it('works with .only and .skip', () => {
      load.describe.only('o', {headers: {a: 'o'}}, () => {
        load.it('s', []);
      });
      load.describe.skip('k', {thresholds: {p95: 1}}, () => {
        load.it('s', []);
      });

      const [first, second] = takeRegistered();
      expect(first).to.containDeep({only: true, headers: {a: 'o'}});
      expect(second).to.containDeep({skip: true, thresholds: {p95: 1}});
    });

    it('still rejects an async function when options are set', () => {
      const define = (async () => undefined) as () => void;

      expect(() => load.describe('late', {headers: {}}, define)).to.throw(
        'load.describe("late"): the function cannot be async',
      );
    });
  });
});

describe('load.parallel', () => {
  it('makes a group of requests, with an optional limit', () => {
    const a = load.get('/a');
    const b = load.get('/b');

    expect(load.parallel([a, b])).to.deepEqual({
      kind: 'parallel',
      requests: [a, b],
    });
    expect(load.parallel([a], {limit: 2})).to.containEql({limit: 2});
  });

  it('throws a TypeError for an empty list', () => {
    expect(() => load.parallel([])).to.throw(TypeError, {
      message: /the list of requests cannot be empty/,
    });
  });

  it('throws a TypeError for an item that is not a request', () => {
    const bad = [load.step({think: 1})] as never;

    expect(() => load.parallel(bad)).to.throw(TypeError, {
      message: /every item must be a request/,
    });
  });

  it('throws a TypeError for a limit that is not a whole number of 1 or more', () => {
    for (const limit of [0, -1, 1.5, Number.NaN]) {
      expect(() => load.parallel([load.get('/a')], {limit})).to.throw(
        TypeError,
        {message: /the limit must be a whole number above 0/},
      );
    }
  });

  it('works inside a loop step', () => {
    const group = load.parallel([load.get('/a')]);

    expect(load.step({loop: [group], count: 2})).to.deepEqual({
      kind: 'raw',
      step: {loop: [group], count: 2},
    });
  });
});
