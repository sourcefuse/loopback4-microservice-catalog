// /* eslint-disable @typescript-eslint/naming-convention */
import {expect} from '@loopback/testlab';
import {STATUS_CODE} from '@sourceloop/core';
import {AuthErrorKeys} from 'loopback4-authentication';
import {describe, it} from 'mocha';
import {
  changePassword,
  getRefreshToken,
  loginToAPI,
  requestToken,
} from './utils';

const username = 'platform.admin@yopmail.com';
const password = 'test123!@#'; //NOSONAR
const newPassword = 'new_test123!@#';

describe('Authentication microservice', () => {
  it('should give status 422 for login request with no client credentials', async () => {
    const reqData = {};
    const response = await loginToAPI(reqData);
    expect(response.status).to.equal(STATUS_CODE.UNPROCESSED_ENTITY);
    expect(response).to.have.property('error');
  });
  it('should give status 422 for login request with no user credentials', async () => {
    const reqData = {
      clientId: 'webapp',
    };
    const response = await loginToAPI(reqData);
    expect(response.status).to.equal(STATUS_CODE.UNPROCESSED_ENTITY);
    expect(response).to.have.property('error');
  });
  it('should give status 401 for login request with wrong client credentials', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'web1', // eslint-disable-next-line
      username: 'someuser',
      password: 'somepassword', //NOSONAR
    };
    const response = await loginToAPI(reqData);
    expect(response.status).to.equal(STATUS_CODE.UNAUTHORISED);
    expect(response).to.have.property('error');
  });
  it('should give status 401 for login request with wrong user credentials', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'webapp', // eslint-disable-next-line
      username: 'someuser',
      password: 'somepassword', //NOSONAR
    };
    const response = await loginToAPI(reqData);
    expect(response.status).to.equal(STATUS_CODE.UNAUTHORISED);
    expect(response).to.have.property('error');
  });
  it('should give status 200 for login request', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'webapp', // eslint-disable-next-line
      username,
      password,
    };
    const response = await loginToAPI(reqData);
    expect(response.status).to.equal(STATUS_CODE.OK);
  });

  it('should return code in response', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'webapp', // eslint-disable-next-line
      username,
      password,
    };
    const reqForCode = await loginToAPI(reqData);
    expect(reqForCode.status).to.equal(STATUS_CODE.OK);
    expect(reqForCode.body).to.have.property('code');
  });

  it('should return refresh token, access token, expires in response', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'webapp', // eslint-disable-next-line
      username,
      password,
    };
    const reqForCode = await loginToAPI(reqData);
    expect(reqForCode.status).to.equal(STATUS_CODE.OK);
    const response = await requestToken(reqForCode.body.code);
    expect(response.body).to.have.properties([
      'accessToken',
      'refreshToken',
      'expires',
    ]);
  });

  it('should return refresh token and access token for token refresh request', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'webapp', // eslint-disable-next-line
      username,
      password,
    };
    const reqForCode = await loginToAPI(reqData);
    expect(reqForCode.status).to.equal(STATUS_CODE.OK);
    const reqForToken = await requestToken(reqForCode.body.code);
    const response = await getRefreshToken(
      reqForToken.body.accessToken,
      reqForToken.body.refreshToken,
    );
    expect(response.body).to.have.properties(['accessToken', 'refreshToken']);
  });

  it('should throw error when login for external user', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'webapp', // eslint-disable-next-line
      username: 'platform.admin@mail.com',
      password,
    };
    const reqForCode = await loginToAPI(reqData);
    expect(reqForCode.status).to.equal(STATUS_CODE.UNAUTHORISED);

    expect(reqForCode.body.error.message.message).to.equal(
      AuthErrorKeys.InvalidCredentials,
    );
  });

  it('should change password successfully for internal user', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'webapp', // eslint-disable-next-line
      username,
      password,
    };
    const reqForCode = await loginToAPI(reqData);
    expect(reqForCode.status).to.equal(STATUS_CODE.OK);

    const reqForToken = await requestToken(reqForCode.body.code);
    const accessToken = reqForToken.body.accessToken;
    const response = await changePassword(accessToken, {
      username,
      password: newPassword,
      refreshToken: reqForToken.body.refreshToken,
    });
    expect(response.status).to.equal(STATUS_CODE.OK);
  });

  it('should return refresh token and access token for token refresh request with new password', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'webapp', // eslint-disable-next-line
      username,
      password: newPassword,
    };
    const reqForCode = await loginToAPI(reqData);
    expect(reqForCode.status).to.equal(STATUS_CODE.OK);
    const reqForToken = await requestToken(reqForCode.body.code);
    const response = await getRefreshToken(
      reqForToken.body.accessToken,
      reqForToken.body.refreshToken,
    );
    expect(response.body).to.have.properties(['accessToken', 'refreshToken']);
  });

  it('should revert to previous password successfully for internal user', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'webapp', // eslint-disable-next-line
      username,
      password: newPassword,
    };
    const reqForCode = await loginToAPI(reqData);
    expect(reqForCode.status).to.equal(STATUS_CODE.OK);
    const reqForToken = await requestToken(reqForCode.body.code);
    const accessToken = reqForToken.body.accessToken;
    const response = await changePassword(accessToken, {
      username,
      password,
      refreshToken: reqForToken.body.refreshToken,
    });
    expect(response.status).to.equal(STATUS_CODE.OK);
  });

  it('should return 401 for token refresh request when Authentication token invalid', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'webapp', // eslint-disable-next-line
      username,
      password,
    };
    const reqForCode = await loginToAPI(reqData);
    expect(reqForCode.status).to.equal(STATUS_CODE.OK);
    const reqForToken = await requestToken(reqForCode.body.code);
    const response = await getRefreshToken(
      'abc',
      reqForToken.body.refreshToken,
    );
    expect(response.status).to.equal(STATUS_CODE.UNAUTHORISED);
  });

  it('should return 401 for token refresh request when Authentication token missing', async () => {
    const reqData = {
      // eslint-disable-next-line
      client_id: 'webapp', // eslint-disable-next-line
      username,
      password,
    };
    const reqForCode = await loginToAPI(reqData);
    expect(reqForCode.status).to.equal(STATUS_CODE.OK);
    const reqForToken = await requestToken(reqForCode.body.code);
    const response = await getRefreshToken(null, reqForToken.body.refreshToken);
    expect(response.status).to.equal(STATUS_CODE.UNAUTHORISED);
  });
});
