// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable @typescript-eslint/naming-convention*/
import {Client, expect} from '@loopback/testlab';
import {AuthMultitenantExampleApplication} from '../..';
import {setupApplication} from './test-helper';

describe('PingController', () => {
  let app: AuthMultitenantExampleApplication;
  let client: Client;

  const accessToken = {
    john: null,
    sarah: null,
  };

  const clientId = 'temp_client';
  const clientSecret = 'temp_secret';
  const todo = {
    title: 'Testing',
    description: 'Test description',
  };
  let todoId: string;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  before('get auth tokens', async () => {
    const johnAuthRes = await client.post('/auth/login-token').send({
      client_id: clientId,
      client_secret: clientSecret,
      username: 'john.doe@example.com',
      password: 'test123!@#',
    });
    const sarahAuthRes = await client.post('/auth/login-token').send({
      client_id: clientId,
      client_secret: clientSecret,
      username: 'sarah.rafferty@example.com',
      password: 'test123!@#',
    });
    accessToken.john = johnAuthRes.body.accessToken;
    accessToken.sarah = sarahAuthRes.body.accessToken;
  });

  after(async () => {
    await app.stop();
  });

  it(`creates a ToDo object with John's creds`, async () => {
    const res = await client
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken.john}`)
      .send(todo)
      .expect(200);
    expect(res.body).to.containEql(todo);
    todoId = res.body.id;
  });

  it(`fetches ToDo object by ID with John's creds`, async () => {
    const res = await client
      .get(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${accessToken.john}`)
      .expect(200);
    expect(res.body).to.containEql(todo);
  });

  it(`fails to fetch ToDo object by ID with Sarah's creds`, async () => {
    await client
      .get(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${accessToken.sarah}`)
      .expect(403);
  });
});
