// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {scenarioOf} from '../../helpers';
import {load} from '../../../scenario/builder';
import {resolveThresholds} from '../../../project/config';
import {findHeavyEndpoints} from '../../../project/heavy';
import type {Thresholds} from '../../../types';
import type {LoadedScenario} from '../../../project/types';

/**
 * A loaded scenario whose endpoints have these p95 limits, by id. Only its
 * `endpoints` map matters to the code under test, not its scenario.
 */
function loaded(limits: Record<string, number>, name = 's'): LoadedScenario {
  return {
    scenario: scenarioOf(name, [load.get('/x')]),
    endpoints: new Map(
      Object.entries(limits).map(([id, p95]) => [id, resolveThresholds({p95})]),
    ),
  };
}

describe('findHeavyEndpoints', () => {
  it('does not count a limit of 1000 ms', () => {
    expect(findHeavyEndpoints([loaded({'GET /a': 1000})])).to.deepEqual([]);
  });

  it('counts a limit of 1001 ms', () => {
    expect(findHeavyEndpoints([loaded({'GET /a': 1001})])).to.deepEqual([
      {id: 'GET /a', p95: 1001},
    ]);
  });

  it('finds none when every endpoint has the default limit of 500 ms', () => {
    const defaults: Thresholds = {};
    const scenario: LoadedScenario = {
      scenario: scenarioOf('s', [load.get('/a')]),
      endpoints: new Map([['GET /a', resolveThresholds(defaults)]]),
    };

    expect(findHeavyEndpoints([scenario])).to.deepEqual([]);
  });

  it('counts every endpoint whose limit is above 1000 ms', () => {
    const scenario: LoadedScenario = {
      scenario: scenarioOf('s', [load.get('/a'), load.get('/b')]),
      endpoints: new Map([
        ['GET /a', resolveThresholds({p95: 2000})],
        ['GET /b', resolveThresholds({p95: 2000})],
      ]),
    };

    expect(findHeavyEndpoints([scenario]).map(h => h.id)).to.deepEqual([
      'GET /a',
      'GET /b',
    ]);
  });

  it('counts the same id in two scenarios once', () => {
    const result = findHeavyEndpoints([
      loaded({'GET /a': 2000}, 'one'),
      loaded({'GET /a': 2000}, 'two'),
    ]);

    expect(result).to.deepEqual([{id: 'GET /a', p95: 2000}]);
  });

  it('counts an id once when it is heavy in one scenario and default in another', () => {
    const result = findHeavyEndpoints([
      loaded({'GET /a': 500}, 'one'),
      loaded({'GET /a': 2000}, 'two'),
    ]);

    expect(result).to.deepEqual([{id: 'GET /a', p95: 2000}]);
  });

  it('gives one row with the highest limit when the limits differ', () => {
    const result = findHeavyEndpoints([
      loaded({'GET /a': 3000}, 'one'),
      loaded({'GET /a': 5000}, 'two'),
      loaded({'GET /a': 2000}, 'three'),
    ]);

    expect(result).to.deepEqual([{id: 'GET /a', p95: 5000}]);
  });

  it('lists the ids in the order in which they first appear', () => {
    const result = findHeavyEndpoints([
      loaded({'GET /b': 2000, 'GET /a': 2000}, 'one'),
      loaded({'GET /c': 2000, 'GET /b': 3000}, 'two'),
    ]);

    expect(result).to.deepEqual([
      {id: 'GET /b', p95: 3000},
      {id: 'GET /a', p95: 2000},
      {id: 'GET /c', p95: 2000},
    ]);
  });
});
