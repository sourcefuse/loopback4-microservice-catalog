import dotenv from 'dotenv';
import request from 'supertest';

dotenv.config({
  path: __dirname + '/./../../../.env',
});
const BASE_URL = process.env.LAMBDA_URL;

export async function loginToAPI(reqData: object) {
  process.env.JWT_ISSUER = 'sourcefuse';
  return request(BASE_URL).post(`/auth/login`).send(reqData);
}

export async function requestToken(code: string) {
  const useragent = 'test';
  const deviceId = 'test';
  const useragentName = 'user-agent';
  const deviceIdName = 'device_id';

  return request(BASE_URL)
    .post(`/auth/token`)
    .set(deviceIdName, deviceId)
    .set(useragentName, useragent)
    .send({
      clientId: 'webapp',
      code: code,
    });
}

export async function getRefreshToken(
  accessToken: string | null,
  refreshToken: string,
) {
  return request(BASE_URL)
    .post(`/auth/token-refresh`)
    .send({refreshToken: refreshToken})
    .set('Authorization', `Bearer ${accessToken}`);
}

export async function changePassword(accessToken: string, reqData: object) {
  return request(BASE_URL)
    .patch('/auth/change-password')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(reqData);
}
