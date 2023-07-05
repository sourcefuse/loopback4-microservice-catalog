// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {OptionsRepository, QuestionRepository} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {Options} from '../../models';
import {QuestionStatus, QuestionType} from '../../enum';

describe('Option Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let optionsRepo: OptionsRepository;
  let questionRepo: QuestionRepository;
  const basePath = '/question/1/options';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  afterEach(deleteMockData);

  it('it gives 200 and returns option created', async () => {
    const option = new Options({
      name: 'Option 5',
      displayOrder: 5,
    });
    await addQuestion();
    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(option)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });

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

  it('it gives 204 and deletes option successfully', async () => {
    await addQuestion();
    const optionToBeDeleted = await addOption();
    await client
      .del(`${basePath}/${optionToBeDeleted.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('it gives 401 and returns error', async () => {
    const option = new Options({
      name: 'option one',
      displayOrder: 1,
    });
    await addQuestion();
    const response = await client.post(`${basePath}`).send(option).expect(401);
    expect(response.statusCode).have.equal(401);
    expect(response).to.have.property('error');
  });

  it('it gives status 200 and data of the respective id', async () => {
    const option = await addOption();
    const response = await client
      .get(`${basePath}/${option.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body)
      .to.have.property('id')
      .to.be.equal(`${option.body.id}`);
  });

  it('it gives 204 and updates the data respective to entity id', async () => {
    const optionCreated = await addOption();
    const optionToUpdate = {
      name: 'option two',
    };
    await client
      .patch(`${basePath}/${optionCreated.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(optionToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${optionCreated.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.name).to.be.equal('option two');
  });

  async function addQuestion() {
    await questionRepo.createAll([
      {
        name: 'Question 1',
        questionType: QuestionType.TEXT,
        uid: 'QR00001',
        status: QuestionStatus.DRAFT,
      },
    ]);
  }

  async function addOption() {
    return client.post(basePath).set('authorization', `Bearer ${token}`).send({
      name: 'Option 5',
      displayOrder: 5,
    });
  }

  async function deleteMockData() {
    await optionsRepo.deleteAllHard();
  }

  async function givenRepositories() {
    optionsRepo = await app.getRepository(OptionsRepository);
    questionRepo = await app.getRepository(QuestionRepository);
  }
});
