// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {
  exceedsMax,
  judge,
  judgeP95,
  judgeVusers,
} from '../../../report/compare';
import {heavy} from '../../helpers';
import {P95_TARGETS, resolveThresholds} from '../../../project/config';

const LIMITS = resolveThresholds({});
const ok = (p95: number) => ({count: 600, failed: 0, p95});

describe('judge', () => {
  it('fails an endpoint that got no requests', () => {
    expect(judge({count: 0, failed: 0}, LIMITS)).to.deepEqual(['no requests']);
  });

  it('passes under the default cap', () => {
    expect(judge(ok(400), LIMITS)).to.deepEqual([]);
  });

  it('passes at the default cap', () => {
    expect(judge(ok(500), LIMITS)).to.deepEqual([]);
  });

  it('fails above the default cap', () => {
    expect(judge(ok(501), LIMITS)).to.deepEqual(['p95 501 ms > limit 500 ms']);
  });

  it('fails above the error rate and above a cap that the endpoint sets', () => {
    const limits = resolveThresholds({p95: 300});

    expect(judge({count: 100, failed: 2, p95: 301}, limits)).to.deepEqual([
      'error rate 2% > 1%',
      'p95 301 ms > limit 300 ms',
    ]);
  });

  it('passes a p95 above the default cap when the endpoint sets a higher cap', () => {
    const limits = resolveThresholds({p95: P95_TARGETS.supportingApi});

    expect(judge(ok(900), limits)).to.deepEqual([]);
  });
});

describe('judgeP95', () => {
  it('shows a CLS limit with no unit', () => {
    expect(judgeP95(0.3, {p95: 0.25}, '')).to.deepEqual([
      'p95 0.3 > limit 0.25',
    ]);
  });
});

describe('judgeVusers', () => {
  it('passes when no more than the error rate of the vusers failed', () => {
    const vusers = {started: 200, completed: 198, failed: 2};

    expect(judgeVusers(vusers, LIMITS)).to.deepEqual([]);
  });

  it('fails above the error rate', () => {
    const vusers = {started: 180, completed: 176, failed: 4};

    expect(judgeVusers(vusers, LIMITS)).to.deepEqual([
      'vuser failure rate 2.2% > 1%',
    ]);
  });

  it('passes when no vuser started, because the endpoints then fail', () => {
    const vusers = {started: 0, completed: 0, failed: 0};

    expect(judgeVusers(vusers, LIMITS)).to.deepEqual([]);
  });
});

describe('exceedsMax', () => {
  it('is true when the count is above the max', () => {
    expect(exceedsMax(heavy(3, 2))).to.be.true();
  });

  it('is false when the count is equal to the max', () => {
    expect(exceedsMax(heavy(2, 2))).to.be.false();
  });

  it('is false when the count is below the max', () => {
    expect(exceedsMax(heavy(1, 2))).to.be.false();
  });
});
