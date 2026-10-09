// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/*
 * Compiled by tsc only. A `@ts-expect-error` without an error breaks the
 * build, so these lines keep the types of `Datasource` strict.
 */
import type {Datasource, LoadTestConfig} from '../index';

const connector = {
  connect: async () => ({query: async () => ({rows: []}), end: async () => {}}),
};

export const valid: Record<string, Datasource> = {
  postgres: {type: 'postgres', url: 'postgres://u@db/x', database: 'x'},
  custom: {type: 'custom', connector},
  bare: connector,
};

export const inConfig: Pick<LoadTestConfig, 'datasources'> = {
  datasources: valid,
};

// @ts-expect-error `urll` is not an option of a Postgres datasource
export const typo: Datasource = {type: 'postgres', urll: 'x'};

// @ts-expect-error `postgress` is not a datasource type
export const wrongType: Datasource = {type: 'postgress', url: 'x'};
