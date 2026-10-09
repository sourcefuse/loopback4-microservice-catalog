// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {mergeHeaders} from '../../../scenario/headers';
import {token} from '../../../scenario/values';

describe('mergeHeaders', () => {
  it('lets the stronger set win, with its own spelling of the name', () => {
    expect(
      mergeHeaders({Authorization: 'old', 'x-a': '1'}, {authorization: 'new'}),
    ).to.deepEqual({'x-a': '1', authorization: 'new'});
  });

  it('keeps names that only one set has, and takes undefined sets', () => {
    const value = token();

    expect(mergeHeaders({a: '1'}, {b: value})).to.deepEqual({a: '1', b: value});
    expect(mergeHeaders(undefined, {a: '1'})).to.deepEqual({a: '1'});
    expect(mergeHeaders({a: '1'}, undefined)).to.deepEqual({a: '1'});
  });
});
