// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {ignoreOutputErrors} from '../../output';

/** An error with a `code`, as Node gives for a failed write. */
function errorWithCode(code: string): Error {
  return Object.assign(new Error(`write ${code}`), {code});
}

describe('ignoreOutputErrors', () => {
  it('ignores the codes of a terminal or a pipe that is gone', () => {
    ignoreOutputErrors();

    for (const code of ['EPIPE', 'EIO', 'ERR_STREAM_DESTROYED']) {
      expect(() =>
        process.stdout.emit('error', errorWithCode(code)),
      ).to.not.throw();
      expect(() =>
        process.stderr.emit('error', errorWithCode(code)),
      ).to.not.throw();
    }
  });

  it('throws any other error, as Node does with no listener', () => {
    ignoreOutputErrors();

    expect(() =>
      process.stdout.emit('error', errorWithCode('ENOSPC')),
    ).to.throw('write ENOSPC');
    expect(() =>
      process.stderr.emit('error', errorWithCode('ENOSPC')),
    ).to.throw('write ENOSPC');
  });

  it('adds no listener at a second call', () => {
    ignoreOutputErrors();
    const before = [
      process.stdout.listenerCount('error'),
      process.stderr.listenerCount('error'),
    ];

    ignoreOutputErrors();

    expect([
      process.stdout.listenerCount('error'),
      process.stderr.listenerCount('error'),
    ]).to.eql(before);
  });
});
