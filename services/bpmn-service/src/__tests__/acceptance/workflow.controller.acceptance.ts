// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {WorkflowServiceApplication} from '../../application';
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {setUpApplication} from './helper';
import {firstTestBpmnInput, firstTestBpmn} from '../const';
import {MockEngine} from '../mock-engine';
import {MOCK_BPMN_ENGINE_KEY} from '../types';
import {
  WorkflowRepository,
  WorkflowVersionRepository,
} from '../../repositories';

describe('Workflow Controller', () => {
  let app: WorkflowServiceApplication;
  let client: Client;
  let mockBpmnEngine: MockEngine;
  let workflowRepo: WorkflowRepository;
  let workflowVersionRepo: WorkflowVersionRepository;
  const basePath = '/workflows';
  const pass = 'test_password';
  const testUser = {
    id: 1,
    username: 'test_user',
    password: pass,
    permissions: [
      'ViewWorkflow',
      'CreateWorkflow',
      'UpdateWorkflow',
      'DeleteWorkflow',
    ],
  };

  const token = jwt.sign(testUser, 'kdskssdkdfs', {
    expiresIn: 180000,
    issuer: 'sf',
  });

  before('setupApplication', async () => {
    ({app, client} = await setUpApplication());
  });
  before(givenRepositories);
  before(givenMockEngine);

  after(async () => app.stop());

  afterEach(deleteMockData);

  describe('/workflows GET', () => {
    it('gives status 401 when no token is passed', async () => {
      const response = await client.get(basePath).expect(401);
      expect(response).to.have.property('error');
    });

    it('gives status 200 when token is passed, with no existing workflow', async () => {
      const response = await client
        .get(basePath)
        .set('authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.length(0);
    });

    it('gives status 200 when token is passed, with an existing workflow', async () => {
      await client
        .post(basePath)
        .send(firstTestBpmn)
        .set('authorization', `Bearer ${token}`);

      const response = await client
        .get(basePath)
        .set('authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.length(1);
      expect(response.body[0])
        .to.have.property('name')
        .equal(firstTestBpmn.name);
      const dataInEngine = mockBpmnEngine.get(firstTestBpmn.name);
      expect(dataInEngine)
        .to.have.property('file')
        .equal(firstTestBpmn.bpmnFile);
    });
  });

  describe('/workflows POST', () => {
    it('gives status 200 when creating a workflow using correct payload', async () => {
      await client
        .post(basePath)
        .send(firstTestBpmn)
        .set('authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('/workflow/:id PATCH', () => {
    it('gives status 404 when token is passed, with non-existant workflow id', async () => {
      const updatedFile = JSON.stringify(['topic1']);
      const updatedFirstTestBpmn = {
        ...firstTestBpmn,
        bpmnFile: updatedFile,
      };

      await client
        .patch(`${basePath}/0`)
        .send(updatedFirstTestBpmn)
        .set('authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('gives status 204 when token is passed, with an existing workflow id, and workflow is updated', async () => {
      const saved = await client
        .post(basePath)
        .send(firstTestBpmn)
        .set('authorization', `Bearer ${token}`);

      const updatedFile = JSON.stringify(['topic1']);
      const updatedFirstTestBpmn = {
        ...firstTestBpmn,
        bpmnFile: updatedFile,
      };

      await client
        .patch(`${basePath}/${saved.body.id}`)
        .send(updatedFirstTestBpmn)
        .set('authorization', `Bearer ${token}`)
        .expect(204);

      const updated = await client
        .get(basePath)
        .set('authorization', `Bearer ${token}`)
        .expect(200);

      expect(updated.body).to.have.length(1);
      expect(updated.body[0])
        .to.have.property('name')
        .equal(firstTestBpmn.name);
      const dataInEngine = mockBpmnEngine.get(updatedFirstTestBpmn.name);
      expect(dataInEngine).to.have.property('file').equal(updatedFile);
    });
  });

  describe('/workflows/:id DELETE', () => {
    it('gives 204 when token is passed, with an existing workflow id', async () => {
      const saved = await client
        .post(basePath)
        .send(firstTestBpmn)
        .set('authorization', `Bearer ${token}`);

      await client
        .delete(`${basePath}/${saved.body.id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('gives 404 when token is passed, with a non-existant workflow id', async () => {
      await client
        .delete(`${basePath}/0`)
        .set('authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/workflows/:id/version/:version DELETE', () => {
    it('gives 204 when token is passed, with an existing non-latest workflow version id', async () => {
      const saved = await client
        .post(basePath)
        .send(firstTestBpmn)
        .set('authorization', `Bearer ${token}`);

      await client
        .patch(`${basePath}/${saved.body.id}`)
        .send(firstTestBpmn)
        .set('authorization', `Bearer ${token}`);

      await client
        .delete(
          `${basePath}/${saved.body.id}/version/${saved.body.workflowVersion}`,
        )
        .set('authorization', `Bearer ${token}`)
        .expect(204);
    });

    it('gives 404 when token is passed, with a non-existant workflow version id', async () => {
      const saved = await client
        .post(basePath)
        .send(firstTestBpmn)
        .set('authorization', `Bearer ${token}`);

      await client
        .delete(
          `${basePath}/${saved.body.id}/version/${
            saved.body.workflowVersion + 1
          }`,
        )
        .set('authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/workflow/:id/execute POST', () => {
    it('gives 400 when invalid input is passed', async () => {
      const saved = await client
        .post(basePath)
        .send(firstTestBpmn)
        .set('authorization', `Bearer ${token}`);

      const input = {
        ...firstTestBpmnInput,
        valueB: 123,
      };

      await client
        .post(`${basePath}/${saved.body.id}/execute`)
        .send({input})
        .set('authorization', `Bearer ${token}`)
        .expect(400);
    });

    it('gives 200 when valid input is passed, and workflow is completed in the engine', async () => {
      const saved = await client
        .post(basePath)
        .send(firstTestBpmn)
        .set('authorization', `Bearer ${token}`);

      await client
        .post(`${basePath}/${saved.body.id}/execute`)
        .send({input: firstTestBpmnInput})
        .set('authorization', `Bearer ${token}`)
        .expect(200);

      expect(mockBpmnEngine.instances[saved.body.name].complete).to.be.true();
    });

    it('gives 404 when invalid workflow id is passed', async () => {
      await client
        .post(`${basePath}/0/execute`)
        .send({input: firstTestBpmnInput})
        .set('authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('gives 404 when invalid workflow version is passed', async () => {
      const saved = await client
        .post(basePath)
        .send(firstTestBpmn)
        .set('authorization', `Bearer ${token}`);

      await client
        .post(`${basePath}/${saved.body.id}/execute`)
        .send({
          input: firstTestBpmnInput,
          workflowVersion: saved.body.workflowVersion + 1,
        })
        .set('authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('gives 200 when valid workflow version and input is passed, and workflow is completed in the engine', async () => {
      const saved = await client
        .post(basePath)
        .send(firstTestBpmn)
        .set('authorization', `Bearer ${token}`);

      await client
        .post(`${basePath}/${saved.body.id}/execute`)
        .send({
          input: firstTestBpmnInput,
          workflowVersion: saved.body.workflowVersion,
        })
        .set('authorization', `Bearer ${token}`)
        .expect(200);

      expect(mockBpmnEngine.instances[saved.body.name].complete).to.be.true();
    });
  });

  async function deleteMockData() {
    await workflowRepo.deleteAllHard();
    await workflowVersionRepo.deleteAll();
    mockBpmnEngine.clear();
  }

  async function givenRepositories() {
    workflowRepo = await app.getRepository(WorkflowRepository);
    workflowVersionRepo = await app.getRepository(WorkflowVersionRepository);
  }

  async function givenMockEngine() {
    mockBpmnEngine = await app.get<MockEngine>(MOCK_BPMN_ENGINE_KEY);
  }
});
