// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {StringValue} from 'ms';
import ms from 'ms';
import {MS_PER_SECOND} from '../errors';
import type {LoadTestConfig, Scenario} from '../types';
import type {Phase} from './types';

/**
 * The phases of a scenario: its own `phases`, or the ones of `config.ts`.
 * Nothing is validated here: the config check and the loader do that.
 */
export function phasesOf(scenario: Scenario, config: LoadTestConfig): Phase[] {
  return scenario.phases ?? config.phases;
}

/**
 * Seconds that the phases take, or undefined when a time cannot be read.
 * Artillery reads a time as a number of seconds, or as a text such as `20m`.
 */
export function phaseSeconds(phases: Phase[]): number | undefined {
  let total = 0;
  for (const {duration, pause} of phases) {
    const seconds = toSeconds(pause ?? duration);
    if (seconds === undefined) return undefined;
    total += seconds;
  }
  return total;
}

/**
 * Reads a time the way Artillery does: a number, or a text of digits, is a
 * number of seconds. Any other text goes to the `ms` package, which gives
 * milliseconds.
 */
function toSeconds(value: number | string | undefined): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string' || value.trim() === '') return undefined;
  if (Number.isInteger(Number(value))) return Number(value);
  // `ms` gives undefined for a text that it cannot read, but its type does not say so.
  const milliseconds: number | undefined = ms(value as StringValue);
  return Number.isFinite(milliseconds)
    ? Number(milliseconds) / MS_PER_SECOND
    : undefined;
}

/**
 * Says the load of the phases in one line, for example `3 vusers/s for 60 s`.
 * The baseline keeps this text. Two runs with the same text have the same
 * load, so their p95 values can be compared.
 */
export function describeWorkload(phases: Phase[]): string {
  return phases.map(describePhase).join(', then ');
}

function describePhase(phase: Phase): string {
  const {pause, arrivalCount, arrivalRate, rampTo, duration, maxVusers} = phase;
  let text: string;
  if (pause !== undefined) {
    text = `pause ${time(pause)}`;
  } else if (arrivalCount !== undefined) {
    text = `${arrivalCount} vusers over ${time(duration)}`;
  } else if (rampTo !== undefined) {
    text = `ramp ${arrivalRate} to ${rampTo} vusers/s over ${time(duration)}`;
  } else {
    text = `${arrivalRate} vusers/s for ${time(duration)}`;
  }
  return maxVusers === undefined
    ? text
    : `${text} (at most ${maxVusers} vusers at once)`;
}

/** A number is seconds. Artillery reads a text such as `1m` by itself. */
function time(value: number | string | undefined): string {
  return typeof value === 'number' ? `${value} s` : String(value);
}
