// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {OptionsRepository} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';

describe('Option Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let optionsRepo: OptionsRepository;
  const basePath = '/question/{questionId}/options';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  afterEach(deleteMockData);

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(basePath)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('should return count', async () => {
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function deleteMockData() {
    await optionsRepo.deleteAllHard();
  }

  async function givenRepositories() {
    optionsRepo = await app.getRepository(OptionsRepository);
  }
});
