// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import {defaultTokenCheck} from '../../../run/tokenCheck';
import type {Phase} from '../../../scenario/types';

/** The fixed time of the fake clock, in seconds. */
const NOW_SECONDS = 1_800_000_000;
const MARGIN_SECONDS = 120;

describe('defaultTokenCheck', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers({now: NOW_SECONDS * 1000});
  });
  afterEach(() => clock.restore());

  /** Runs the check for a token that has these claims. */
  const check = (claims: Record<string, unknown>, phases: Phase[]) =>
    defaultTokenCheck({
      token: `h.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.s`,
      claims,
      phases,
    });
  const phasesOf = (seconds: number): Phase[] => [
    {duration: seconds, arrivalRate: 1},
  ];

  it('passes a token with no exp claim, whatever the load', () => {
    expect(() => check({iat: NOW_SECONDS}, phasesOf(100_000))).to.not.throw();
  });

  it('passes a token that lives longer than the load plus the margin by one second', () => {
    const load = 600;

    expect(() =>
      check({exp: NOW_SECONDS + load + MARGIN_SECONDS + 1}, phasesOf(load)),
    ).to.not.throw();
  });

  it('stops when the load plus the margin equals the time left', () => {
    const load = 600;

    expect(() =>
      check({exp: NOW_SECONDS + load + MARGIN_SECONDS}, phasesOf(load)),
    ).to.throw({name: 'RunError'});
  });

  it('says the load, the margin and the seconds left in the message', () => {
    expect(() => check({exp: NOW_SECONDS + 300}, phasesOf(600))).to.throw(
      /^The load takes 600 s, and the end of the run needs 120 s more, but the access token expires in 300 s\. Make the load shorter/,
    );
  });

  it('adds the time of every phase, a pause and a ramp included', () => {
    const phases: Phase[] = [
      {duration: 60, arrivalRate: 1},
      {pause: 30},
      {duration: '1m', arrivalRate: 1, rampTo: 5},
    ];
    const load = 150;

    expect(() =>
      check({exp: NOW_SECONDS + load + MARGIN_SECONDS + 1}, phases),
    ).to.not.throw();
    expect(() =>
      check({exp: NOW_SECONDS + load + MARGIN_SECONDS}, phases),
    ).to.throw(/The load takes 150 s/);
  });

  it('stops with a RunError when a phase time cannot be read', () => {
    expect(() =>
      check({exp: NOW_SECONDS + 10_000}, [
        {duration: 'soon' as unknown as number, arrivalRate: 1},
      ]),
    ).to.throw({
      name: 'RunError',
      message: /^The time of a phase cannot be read/,
    });
  });
});
