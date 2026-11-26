// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {juggler} from '@loopback/repository';
import {expect, sinon} from '@loopback/testlab';
import {UserTokensValidAfterRepository} from '../../repositories';

describe('UserTokensValidAfterRepository', () => {
  const revokedAtMs = Date.UTC(2026, 0, 1, 12, 0, 0);
  const revokedAtSec = revokedAtMs / 1000;
  const TTL_MS = 3600 * 1000;
  let clock: sinon.SinonFakeTimers;
  let repo: UserTokensValidAfterRepository;
  let logger: {error: sinon.SinonStub};

  const buildRepo = (
    dataSource: juggler.DataSource,
    failOpen?: boolean,
  ): UserTokensValidAfterRepository =>
    new UserTokensValidAfterRepository(dataSource, logger as never, failOpen);

  beforeEach(() => {
    clock = sinon.useFakeTimers({now: revokedAtMs, toFake: ['Date']});
    logger = {error: sinon.stub()};
    repo = buildRepo(new juggler.DataSource({connector: 'kv-memory'}));
  });

  afterEach(() => clock.restore());

  it('revokes a token issued before the marker', async () => {
    await repo.revoke('u1', TTL_MS);
    expect(await repo.isRevoked('u1', revokedAtSec - 600)).to.be.true();
  });

  it('does not revoke a token issued after the marker', async () => {
    await repo.revoke('u1', TTL_MS);
    expect(await repo.isRevoked('u1', revokedAtSec + 60)).to.be.false();
  });

  it('accepts a token issued in the same second as the marker', async () => {
    clock.tick(500);
    await repo.revoke('u1', TTL_MS);
    expect(await repo.isRevoked('u1', revokedAtSec)).to.be.false();
  });

  it('revokes a token issued one second before the marker', async () => {
    await repo.revoke('u1', TTL_MS);
    expect(await repo.isRevoked('u1', revokedAtSec - 1)).to.be.true();
  });

  it('does not revoke when no marker exists', async () => {
    expect(await repo.isRevoked('u1', revokedAtSec - 600)).to.be.false();
  });

  it('does not revoke tokens of another user', async () => {
    await repo.revoke('u1', TTL_MS);
    expect(await repo.isRevoked('u2', revokedAtSec - 600)).to.be.false();
  });

  it('revokes a token with no iat when a marker exists', async () => {
    await repo.revoke('u1', TTL_MS);
    expect(await repo.isRevoked('u1', undefined)).to.be.true();
  });

  it('applies a user-wide marker to a token carrying a tenant', async () => {
    await repo.revoke('u1', TTL_MS);
    expect(await repo.isRevoked('u1', revokedAtSec - 600, 't1')).to.be.true();
  });

  it('applies a tenant marker only to that tenant', async () => {
    await repo.revoke('u1', TTL_MS, 't1');
    expect(await repo.isRevoked('u1', revokedAtSec - 600, 't1')).to.be.true();
    expect(await repo.isRevoked('u1', revokedAtSec - 600, 't2')).to.be.false();
    expect(await repo.isRevoked('u1', revokedAtSec - 600)).to.be.false();
  });

  it('stores the marker under the user and tenant key with the given ttl', async () => {
    const set = sinon.stub(repo, 'set').resolves();
    await repo.revoke('u1', TTL_MS, 't1');
    sinon.assert.calledOnceWithExactly(
      set,
      'tokensValidAfter:u1:t1',
      sinon.match({validAfter: revokedAtMs}),
      {ttl: TTL_MS},
    );
  });

  describe('when the store is unavailable', () => {
    let failing: juggler.DataSource;

    beforeEach(() => {
      failing = new juggler.DataSource({connector: 'kv-memory'});
      const connector = failing.connector as unknown as {
        get: (...args: unknown[]) => void;
      };
      connector.get = (...args: unknown[]) => {
        const cb = args[args.length - 1] as (e: Error) => void;
        cb(new Error('down'));
      };
    });

    it('fails closed with 503 by default', async () => {
      const err = await buildRepo(failing)
        .isRevoked('u1', revokedAtSec)
        .catch(e => e);
      expect(err.statusCode).to.eql(503);
      sinon.assert.calledOnceWithExactly(
        logger.error,
        sinon.match('Failed to read tokensValidAfter marker for user u1: down'),
      );
    });

    it('lets the request through when fail-open is bound', async () => {
      expect(
        await buildRepo(failing, true).isRevoked('u1', revokedAtSec),
      ).to.be.false();
      sinon.assert.calledOnceWithExactly(
        logger.error,
        sinon.match('Failed to read tokensValidAfter marker for user u1: down'),
      );
    });
  });
});
