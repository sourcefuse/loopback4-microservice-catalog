// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {SectionRepository, SurveyRepository} from '../../repositories';
import {SurveyServiceApplication} from '../application';
import {setUpApplication} from './helper';
import {token} from '../datasources/userCredsAndPermission';
import {Section} from '../../models';
import moment from 'moment';
import {SurveyStatus} from '../../enum';

describe('Survey Section Controller', () => {
  let app: SurveyServiceApplication;
  let client: Client;
  let sectionRepo: SectionRepository;
  let surveyRepo: SurveyRepository;
  const basePath = '/surveys/1/sections';

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  after(deleteMockData);
  it('it gives 200 and adds a section as response', async () => {
    const surveySectionToCreate = new Section({
      name: 'test section 01',
    });
    await createSurvey();
    const response = await client
      .post(`${basePath}`)
      .set('Authorization', `Bearer ${token}`)
      .send(surveySectionToCreate)
      .expect(200);
    expect(response.statusCode).have.equal(200);
    expect(response).to.have.property('body');
  });
  it('it gives 400 survey status in not Draft', async () => {
    const surveySectionToCreate = new Section({
      name: 'test section 02',
    });
    await createSurvey();
    const response = await client
      .post('/surveys/2/sections')
      .set('Authorization', `Bearer ${token}`)
      .send(surveySectionToCreate)
      .expect(400);
    expect(response.statusCode).have.equal(400);
  });

  it('will return all the values with status 200', async () => {
    await createSurvey();
    await addSection();

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.length).to.be.greaterThan(0);
  });

  it('will return where the id matches and status 200', async () => {
    await createSurvey();
    const section = await addSection();

    const response = await client
      .get(`${basePath}/${section.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body)
      .to.have.property('id')
      .to.be.equal(`${section.body.id}`);
  });

  it('will return 404 if section does not exist', async () => {
    await createSurvey();
    await addSection();
    await client
      .get(`${basePath}/id`)
      .set('authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);

    expect(response).to.have.property('error');
  });

  it('should return count', async () => {
    await createSurvey();
    await addSection();
    const response = await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.count).to.be.greaterThanOrEqual(1);
  });
  it('will update the survey  section where id matches and return 204', async () => {
    const surveyToUpdate = {
      name: 'test section patch 11',
    };
    await createSurvey();
    const surveySection = await addSection();

    await client
      .patch(`${basePath}/${surveySection.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(surveyToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${surveySection.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.name).to.be.equal('test section patch 11');
  });

  it('deletes a survey section successfully', async () => {
    await createSurvey();
    const reqToAddSurveySection = await addSection();
    await client
      .del(`${basePath}/${reqToAddSurveySection.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });
  it('gives error on delete when section has no display order', async () => {
    await createSurvey();
    await addSectionWithRepo();
    await client
      .del(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('should increase display order by 1', async () => {
    await createSurvey();
    await addSectionWithRepo();
    await client
      .del(`${basePath}/3`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
    const response = await client
      .get(`${basePath}/4`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.displayOrder).to.be.equal(4);
  });

  async function addSection() {
    return client.post(basePath).set('authorization', `Bearer ${token}`).send({
      name: 'test section 89',
    });
  }

  async function deleteMockData() {
    await sectionRepo.deleteAllHard();
    await surveyRepo.deleteAllHard();
  }

  async function createSurvey() {
    const currentDate = new Date();
    await surveyRepo.createAll([
      {
        name: 'Survey 1',
        startDate: moment(currentDate).format(),
        endDate: moment(
          currentDate.setDate(currentDate.getDate() + 10),
        ).format(),
        surveyText:
          'JTNDcCUzRWludHJvZHVjdGlvbi4lMjB0byUyMHN1cnZleSUzQyUyRnAlM0U=',
        status: SurveyStatus.DRAFT,
      },
      {
        name: 'Survey 2',
        startDate: moment(currentDate).format(),
        endDate: moment(
          currentDate.setDate(currentDate.getDate() + 10),
        ).format(),
        surveyText:
          'JTNDcCUzRWludHJvZHVjdGlvbi4lMjB0byUyMHN1cnZleSUzQyUyRnAlM0U=',
        status: SurveyStatus.ACTIVE,
      },
    ]);
  }

  async function addSectionWithRepo() {
    return sectionRepo.createAll([
      {
        name: 'test section 1',
        displayOrder: 1,
        surveyId: '1',
      },

      {
        name: 'test section 2',
        displayOrder: 3,
        surveyId: '1',
      },
      {
        name: 'test section',
        surveyId: '1',
      },
    ]);
  }

  async function givenRepositories() {
    sectionRepo = await app.getRepository(SectionRepository);
    surveyRepo = await app.getRepository(SurveyRepository);
  }
});
