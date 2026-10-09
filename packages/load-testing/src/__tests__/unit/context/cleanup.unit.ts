// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {Cleanup} from '../../../context/cleanup';
import {errorMessage} from '../../../errors';

describe('Cleanup', () => {
  it('runs the cleanups last first, and waits for each one', async () => {
    const cleanup = new Cleanup();
    const calls: string[] = [];
    cleanup.defer(() => calls.push('customer'));
    cleanup.defer(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      calls.push('product');
    });
    cleanup.defer(() => calls.push('order'));

    await cleanup.run();

    expect(calls).to.deepEqual(['order', 'product', 'customer']);
  });

  it('goes on after a cleanup fails, and returns the failures', async () => {
    const cleanup = new Cleanup();
    const done: string[] = [];
    cleanup.defer(() => done.push('first'));
    cleanup.defer(() => {
      throw new Error('delete refused');
    });
    cleanup.defer(() => Promise.reject('plain text'));
    cleanup.defer(() => done.push('last'));

    const failures = await cleanup.run();

    expect(done).to.deepEqual(['last', 'first']);
    expect(failures.map(errorMessage)).to.deepEqual([
      'plain text',
      'delete refused',
    ]);
  });

  it('runs a cleanup one time', async () => {
    const cleanup = new Cleanup();
    let runs = 0;
    cleanup.defer(() => runs++);

    await cleanup.run();
    await cleanup.run();

    expect(runs).to.equal(1);
  });
});
