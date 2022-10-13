// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import {Client, expect} from '@loopback/testlab';
import {TestingApplication} from '../fixtures/application';
import {TestHelperKey} from '../fixtures/keys';
import {TestHelperService} from '../fixtures/services';
import {setupApplication} from './test-helper';

describe('SignUp Request Controller', () => {
  let app: TestingApplication;
  let client: Client;
  let helper: TestHelperService;
  const basePath = '/auth/sign-up';
  const sampleEmail = 'xyz@gmail.com';
  const reqData = {
    email: sampleEmail,
  };

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    helper = await app.get(TestHelperKey);
  });
  after(() => {
    helper.reset();
    return app.stop();
  });

  afterEach(() => {
    delete process.env.JWT_ISSUER;
    delete process.env.JWT_SECRET;
  });

  it('gives status 200 when token is created', async () => {
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`${basePath}/create-token`).send(reqData).expect(204);
  });

  it('gives status 204 when token is created', async () => {
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`${basePath}/create-token`).send(reqData).expect(204);
    const token = helper.get('TOKEN');
    const email = helper.get('EMAIL');
    expect(token).to.be.String();
    expect(token).to.not.be.equal('');
    expect(email).to.be.equal(reqData.email);
  });

  it('gives status 204 and user details for creating user', async () => {
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`${basePath}/create-token`).send(reqData).expect(204);
    const reqDta = {
      email: sampleEmail,
      password: 'test_password',
    };
    const token = helper.get('TOKEN');
    const response = await client
      .post(`/auth/sign-up/create-user`)
      .set('Authorization', `Bearer ${token}`)
      .send(reqDta)
      .expect(200);
    expect(response.body).to.have.properties(['user', 'email']);
    expect(response.body.email).to.be.equal(sampleEmail);
  });
});
