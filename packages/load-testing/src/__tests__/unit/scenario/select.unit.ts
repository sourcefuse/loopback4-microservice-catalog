// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {scenarioOf} from '../../helpers';
import {selectScenarios} from '../../../scenario/select';
import type {Scenario} from '../../../types';

/** What the loader gives for a scenario: the scenario is inside. */
const loaded = (name: string, extra: Partial<Scenario> = {}) => ({
  scenario: {...scenarioOf(name, []), ...extra},
});

const names = (items: Array<{scenario: Scenario}>) =>
  items.map(item => item.scenario.name);

describe('selectScenarios', () => {
  it('runs every scenario when none has only or skip', () => {
    const all = [loaded('a'), loaded('b')];

    const {run, skipped} = selectScenarios(all, {});

    expect(names(run)).to.deepEqual(['a', 'b']);
    expect(skipped).to.deepEqual([]);
  });

  it('leaves out a scenario with skip, and lists it as skipped', () => {
    const {run, skipped} = selectScenarios(
      [loaded('a'), loaded('b', {skip: true})],
      {},
    );

    expect(names(run)).to.deepEqual(['a']);
    expect(names(skipped)).to.deepEqual(['b']);
  });

  it('stops in CI when every scenario is skipped', () => {
    const all = [loaded('a', {skip: true}), loaded('b', {skip: true})];

    expect(() => selectScenarios(all, {CI: 'true'})).to.throw({
      name: 'ConfigError',
      message: 'No scenario runs: every scenario has .skip',
    });
  });

  it('runs nothing and does not stop locally when every scenario is skipped', () => {
    const {run, skipped} = selectScenarios([loaded('a', {skip: true})], {});

    expect(run).to.deepEqual([]);
    expect(names(skipped)).to.deepEqual(['a']);
  });

  it('runs just the scenarios with only', () => {
    const {run, skipped} = selectScenarios(
      [loaded('a'), loaded('b', {only: true}), loaded('c')],
      {},
    );

    expect(names(run)).to.deepEqual(['b']);
    expect(skipped).to.deepEqual([]);
  });

  it('lets skip win over only', () => {
    const {run, skipped} = selectScenarios(
      [loaded('a', {only: true, skip: true}), loaded('b', {only: true})],
      {},
    );

    expect(names(run)).to.deepEqual(['b']);
    expect(names(skipped)).to.deepEqual(['a']);
  });

  it('runs nothing when every scenario with only also has skip, and lists all as skipped', () => {
    const {run, skipped} = selectScenarios(
      [loaded('a'), loaded('b', {only: true, skip: true}), loaded('c')],
      {},
    );

    expect(run).to.deepEqual([]);
    expect(names(skipped)).to.deepEqual(['a', 'b', 'c']);
  });

  describe('when CI is set', () => {
    it('stops the run for an only, and names the scenarios', () => {
      const all = [
        loaded('a'),
        loaded('b', {only: true, group: ['Orders']}),
        loaded('c', {only: true}),
      ];

      expect(() => selectScenarios(all, {CI: 'true'})).to.throw(
        '.only is not allowed when CI is set: Orders › b, c',
      );
      expect(() => selectScenarios(all, {CI: '1'})).to.throw(/only is not/);
    });

    it('runs scenarios with skip, and allows an only when CI is empty, 0 or false', () => {
      const all = [loaded('a', {only: true}), loaded('b', {skip: true})];

      expect(() =>
        selectScenarios([loaded('x'), loaded('y', {skip: true})], {CI: 'true'}),
      ).to.not.throw();
      for (const ci of [undefined, '', '0', 'false', 'False', 'FALSE']) {
        expect(names(selectScenarios(all, {CI: ci}).run)).to.deepEqual(['a']);
      }
    });

    it('counts true, 1 and yes as CI', () => {
      const all = [loaded('a', {only: true})];

      for (const ci of ['true', '1', 'yes']) {
        expect(() => selectScenarios(all, {CI: ci})).to.throw(/only is not/);
      }
    });
  });
});
