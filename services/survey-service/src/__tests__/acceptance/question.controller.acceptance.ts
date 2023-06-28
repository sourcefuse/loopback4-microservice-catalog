// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {QuestionRepository} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';

describe('Question Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let questionRepo: QuestionRepository;
  const basePath = '/questions';
  const pass = 'test_password';
  const testUser = {
    id: 1,
    username: 'test_user',
    password: pass,
    permissions: [
      'ViewQuestion',
      'UpdateQuestion',
      'CreateQuestion',
      'DeleteQuestion',
      'ViewAnyQuestion',
      'UpdateAnyQuestion',
      'CreateAnyQuestion',
      'DeleteAnyQuestion',
    ],
  };

  const token = jwt.sign(testUser, 'kdskssdkdfs', {
    expiresIn: 180000,
    issuer: 'sf',
  });

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

  it('deletes a question successfully', async () => {
    const reqToAddMessage = await addQuestion();
    await client
      .del(`${basePath}/${reqToAddMessage.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addQuestion() {
    const questionToAdd = {
      questionType: 'Single Selection',
      name: 'Question 1',
    };
    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(questionToAdd);
  }

  async function deleteMockData() {
    await questionRepo.deleteAllHard();
  }

  async function givenRepositories() {
    questionRepo = await app.getRepository(QuestionRepository);
  }
});
