// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {coverage, readSpec, specEndpoints} from '../../../project/spec';

const SPEC = {
  paths: {
    '/ping': {get: {}},
    '/order-items': {get: {}, post: {}},
    '/order-items/{id}': {get: {}, delete: {}, parameters: []},
  },
};

describe('specEndpoints', () => {
  it('lists METHOD /path ids and leaves out /ping', () => {
    expect(specEndpoints(SPEC)).to.deepEqual([
      'GET /order-items',
      'POST /order-items',
      'GET /order-items/{id}',
      'DELETE /order-items/{id}',
    ]);
  });
});

describe('coverage', () => {
  it('counts declared ids that the spec has and lists the rest', () => {
    const declared = [
      'GET /order-items',
      'GET /order-items',
      'GET /order-itms',
    ];

    expect(coverage(declared, specEndpoints(SPEC))).to.deepEqual({
      unknown: ['GET /order-itms'],
      covered: 1,
      total: 4,
    });
  });
});

describe('readSpec', () => {
  it('gives undefined when the file is missing', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-'));

    try {
      expect(readSpec(dir)).to.be.undefined();
    } finally {
      fs.rmSync(dir, {recursive: true});
    }
  });
});
