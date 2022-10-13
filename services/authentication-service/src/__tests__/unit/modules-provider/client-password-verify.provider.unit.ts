// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {AuthClientRepository} from '../../../repositories';
import sinon from 'sinon';
import {ClientPasswordVerifyProvider} from '../../../modules/auth/providers/client-password-verify.provider';
import {AuthClient} from '../../../models';

describe('Client Password Verify Provider', () => {
  let authClientRepo: StubbedInstanceWithSinonAccessor<AuthClientRepository>;
  let clientPasswordVerifyProvider: ClientPasswordVerifyProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('checks for client and returns it', () => {
    it('returns the client', async () => {
      const clientId = 'dummy';
      const clientSecret = 'dummy';
      const client = new AuthClient({
        id: 1,
        clientId: clientId,
        clientSecret: clientSecret,
        secret: 'dummy',
        accessTokenExpiration: 1800,
        refreshTokenExpiration: 1800,
        authCodeExpiration: 1800,
      });
      const findOne = authClientRepo.stubs.findOne;
      findOne.resolves(client);
      const func = clientPasswordVerifyProvider.value();
      const result = await func();
      expect(result).to.eql(client);
      sinon.assert.calledOnce(findOne);
    });
  });

  function setUp() {
    authClientRepo = createStubInstance(AuthClientRepository);
    clientPasswordVerifyProvider = new ClientPasswordVerifyProvider(
      authClientRepo,
    );
  }
});
