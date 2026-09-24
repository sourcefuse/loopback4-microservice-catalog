// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import type {Task} from 'tinybench';
import {BenchmarkError} from '../../errors';
import {deviationLabel, toMetrics} from '../../functions/metrics.function';

function givenTask(result: unknown): Task {
  return {result} as Task;
}

const fullResult = {
  throughput: {mean: 100, min: 90, max: 110},
  latency: {mean: 10, min: 9, max: 11, samples: [1, 2, 3, 4]},
};

describe('toMetrics', () => {
  it('keeps the throughput and latency range', () => {
    const metrics = toMetrics(givenTask(fullResult));

    expect(metrics.throughput).to.eql({mean: 100, min: 90, max: 110});
    expect(metrics.latency).to.eql({mean: 10, min: 9, max: 11});
  });

  it('counts the latency samples', () => {
    expect(toMetrics(givenTask(fullResult)).samples).to.equal(4);
  });

  it('rejects a task that never ran', () => {
    expect(() => toMetrics(undefined)).to.throw(BenchmarkError);
    expect(() => toMetrics(undefined)).to.throw(/produced no result/);
  });

  it('surfaces the message when the callback threw', () => {
    const task = givenTask({...fullResult, error: new Error('boom')});

    expect(() => toMetrics(task)).to.throw(BenchmarkError);
    expect(() => toMetrics(task)).to.throw(
      /The benchmark callback threw: boom/,
    );
  });

  it('rejects a result missing throughput', () => {
    const task = givenTask({latency: fullResult.latency});

    expect(() => toMetrics(task)).to.throw(/missing throughput or latency/);
  });

  it('rejects a result missing latency', () => {
    const task = givenTask({throughput: fullResult.throughput});

    expect(() => toMetrics(task)).to.throw(/missing throughput or latency/);
  });
});

describe('deviationLabel', () => {
  it('follows the gate rather than judging the number itself', () => {
    expect(deviationLabel(-41, true)).to.equal('REGRESSION');
    // A big drop while the baseline is still building is not a regression.
    expect(deviationLabel(-41, false)).to.equal('STABLE');
  });

  it('calls a gain past the threshold an improvement', () => {
    expect(deviationLabel(41, false)).to.equal('IMPROVEMENT');
  });

  it('calls anything inside the threshold stable', () => {
    expect(deviationLabel(0, false)).to.equal('STABLE');
    expect(deviationLabel(40, false)).to.equal('STABLE');
  });
});
