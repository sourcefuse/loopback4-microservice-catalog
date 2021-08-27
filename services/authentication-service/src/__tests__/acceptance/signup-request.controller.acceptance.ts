import {Client, expect} from '@loopback/testlab';
import {TestingApplication} from '../fixtures/application';
import {setupApplication} from './test-helper';

describe('SignUp Request Controller', () => {
  let app: TestingApplication;
  let client: Client;
  const basePath = '/auth/sign-up';
  const reqData = {
    email: 'xyz@gmail.com',
  };

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  after(async () => app.stop());

  afterEach(() => {
    delete process.env.JWT_ISSUER;
    delete process.env.JWT_SECRET;
  });

  it('gives status 200 when token is created', async () => {
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    await client.post(`${basePath}/create-token`).send(reqData).expect(200);
  });

  it('gives status 200 and code, email when token is created', async () => {
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const response = await client
      .post(`${basePath}/create-token`)
      .send(reqData)
      .expect(200);
    expect(response.body).to.have.properties(['code', 'email']);
    expect(response.body.email).to.be.equal('xyz@gmail.com');
  });

  it('gives status 200 and user details for creating user', async () => {
    process.env.JWT_ISSUER = 'test';
    process.env.JWT_SECRET = 'test';
    const respGot = await client
      .post(`${basePath}/create-token`)
      .send(reqData)
      .expect(200);
    const reqDta = {
      email: 'xyz@gmail.com',
      password: 'test_password',
    };
    const response = await client
      .post(`/auth/sign-up/create-user`)
      .set('Authorization', `Bearer ${respGot.body.code}`)
      .send(reqDta)
      .expect(200);
    expect(response.body).to.have.properties(['user', 'email']);
    expect(response.body.email).to.be.equal('xyz@gmail.com');
  });
});
