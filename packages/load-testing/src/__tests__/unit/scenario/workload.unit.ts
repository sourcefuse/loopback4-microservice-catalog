// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {
  describeWorkload,
  phasesOf,
  phaseSeconds,
} from '../../../scenario/workload';
import {scenarioOf} from '../../helpers';
import {load} from '../../../scenario/builder';

describe('phasesOf', () => {
  const config = {phases: [{duration: 60, arrivalRate: 1}]};

  it('gives the phases of the package when the scenario has none', () => {
    const scenario = scenarioOf('s', [load.get('/a')]);

    expect(phasesOf(scenario, config)).to.equal(config.phases);
  });

  it('prefers the phases of the scenario, with no merge', () => {
    const own = [{pause: 5}, {duration: 10, arrivalRate: 2}];
    const scenario = scenarioOf('s', [load.get('/a')], {phases: own});

    expect(phasesOf(scenario, config)).to.equal(own);
  });
});

describe('describeWorkload', () => {
  it('says the rate and the time of a flat phase', () => {
    expect(describeWorkload([{duration: 60, arrivalRate: 3}])).to.equal(
      '3 vusers/s for 60 s',
    );
  });

  it('says both rates of a ramp', () => {
    expect(
      describeWorkload([{duration: 120, arrivalRate: 1, rampTo: 10}]),
    ).to.equal('ramp 1 to 10 vusers/s over 120 s');
  });

  it('says the count of an arrival count phase', () => {
    expect(describeWorkload([{duration: 30, arrivalCount: 100}])).to.equal(
      '100 vusers over 30 s',
    );
  });

  it('says the phases in order, with a pause', () => {
    expect(
      describeWorkload([
        {duration: 60, arrivalRate: 3},
        {pause: 10},
        {duration: 30, arrivalRate: 3, rampTo: 10},
      ]),
    ).to.equal(
      '3 vusers/s for 60 s, then pause 10 s, then ramp 3 to 10 vusers/s over 30 s',
    );
  });

  it('keeps a time that Artillery reads from text, and says the vuser cap', () => {
    expect(
      describeWorkload([{duration: '1m', arrivalRate: 3, maxVusers: 10}]),
    ).to.equal('3 vusers/s for 1m (at most 10 vusers at once)');
  });
});

describe('phaseSeconds', () => {
  it('adds the time of every phase, pauses too', () => {
    expect(
      phaseSeconds([{duration: 60, arrivalRate: 3}, {pause: 10}]),
    ).to.equal(70);
  });

  it('reads a time that is a text, the way Artillery does', () => {
    expect(phaseSeconds([{duration: '1m', arrivalRate: 3}])).to.equal(60);
    expect(phaseSeconds([{duration: '20m', arrivalRate: 1}])).to.equal(1200);
    expect(
      phaseSeconds([{pause: '30s'}, {duration: 5, arrivalRate: 1}]),
    ).to.equal(35);
  });

  it('reads a text of digits as seconds, not as milliseconds', () => {
    expect(phaseSeconds([{duration: '90', arrivalRate: 3}])).to.equal(90);
  });

  it('is undefined when a time cannot be read', () => {
    expect(
      phaseSeconds([{duration: 'soon', arrivalRate: 3}]),
    ).to.be.undefined();
    expect(phaseSeconds([{duration: '', arrivalRate: 3}])).to.be.undefined();
  });
});
