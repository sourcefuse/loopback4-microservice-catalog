// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {Client, expect} from '@loopback/testlab';
import {configDotenv} from 'dotenv';
import * as jwt from 'jsonwebtoken';
import {WorkflowServiceApplication} from '../../application';
import {CamundaConnectorService} from '../../connectors/camunda';
import {Workflow, WorkflowVersion} from '../../models';
import {
  WorkflowRepository,
  WorkflowVersionRepository,
} from '../../repositories';
import {firstTestBpmnInput, generateBpmn} from '../const';
import {setUpApplication} from './helper';
configDotenv();
describe('Workflow Controller: With Camunda', () => {
  let app: WorkflowServiceApplication;
  let client: Client;
  let workflowRepo: WorkflowRepository;
  let workflowVersionRepo: WorkflowVersionRepository;
  let camundaService: CamundaConnectorService;
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
      'ExecuteWorkflow',
    ],
  };

  const token = jwt.sign(testUser, 'kdskssdkdfs', {
    expiresIn: 180000,
    issuer: 'sf',
  });

  before('setupApplication', async function () {
    if (!process.env.WORKFLOW_ENGINE_BASE_URL) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this.skip();
    }
    ({app, client} = await setUpApplication(false));
  });
  before(givenRepositories);

  after(async () => app?.stop());

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
      const workflow = generateBpmn();
      await client
        .post(basePath)
        .send(workflow)
        .set('authorization', `Bearer ${token}`);

      const response = await client
        .get(basePath)
        .set('authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).to.have.length(1);
      expect(response.body[0]).to.have.property('name').equal(workflow.name);
    });
  });

  describe('/workflows POST', () => {
    it('gives status 200 when creating a workflow using correct payload', async () => {
      const workflow = generateBpmn();

      await client
        .post(basePath)
        .send(workflow)
        .set('authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('/workflow/:id PATCH', () => {
    it('gives status 404 when token is passed, with non-existant workflow id', async () => {
      const workflow = generateBpmn();
      await client
        .patch(`${basePath}/0`)
        .send(workflow)
        .set('authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('gives status 204 when token is passed, with an existing workflow id, and workflow is updated', async () => {
      const workflow = generateBpmn();

      const saved = await client
        .post(basePath)
        .send(workflow)
        .set('authorization', `Bearer ${token}`);

      await client
        .patch(`${basePath}/${saved.body.id}`)
        .send({
          ...workflow,
          bpmnFile: workflow.bpmnFile.replace('topic1', 'topic4'),
        })
        .set('authorization', `Bearer ${token}`)
        .expect(204);

      const {body: workflows} = await client
        .get(
          `${basePath}?filter=${JSON.stringify({include: ['workflowVersions']})}`,
        )
        .set('authorization', `Bearer ${token}`)
        .expect(200);

      expect(workflows).to.have.length(1);
      expect(workflows[0].workflowVersions.length).to.equal(2);
      const maxVersion = workflows[0].workflowVersions.reduce(
        (prev: WorkflowVersion, current: WorkflowVersion) =>
          prev.version > current.version ? prev : current,
      );

      expect(workflows[0].externalIdentifier).to.equal(
        maxVersion.externalWorkflowId,
      );
    });
  });

  describe('/workflows/:id DELETE', () => {
    it('gives 204 when token is passed, with an existing workflow id', async () => {
      const workflow = generateBpmn();

      const saved = await client
        .post(basePath)
        .send(workflow)
        .set('authorization', `Bearer ${token}`);

      const deploymentId = await camundaService
        .get<AnyObject>(saved.body.externalIdentifier)
        .then(res => res.deploymentId);
      await client
        .delete(`${basePath}/${saved.body.id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(204);

      // due to a bug in current implementation where all the definitions are deleted
      // but we have to delete the deployment manually
      await camundaService.deleteDeployment(deploymentId, true);
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
      const workflow = generateBpmn();
      const saved = await client
        .post(basePath)
        .send(workflow)
        .set('authorization', `Bearer ${token}`);

      await client
        .patch(`${basePath}/${saved.body.id}`)
        .send({
          ...workflow,
          bpmnFile: workflow.bpmnFile.replace('topic1', 'topic4'),
        })
        .set('authorization', `Bearer ${token}`);
      const deploymentId = await camundaService
        .get<AnyObject>(saved.body.externalIdentifier)
        .then(res => res.deploymentId);
      await client
        .delete(
          `${basePath}/${saved.body.id}/version/${saved.body.workflowVersion}`,
        )
        .set('authorization', `Bearer ${token}`)
        .expect(204);

      // due to a bug in current implementation where all the definitions are deleted
      // but we have to delete the deployment manually
      await camundaService.deleteDeployment(deploymentId, true);
    });

    it('gives 404 when token is passed, with a non-existant workflow version id', async () => {
      const workflow = generateBpmn();
      const saved = await client
        .post(basePath)
        .send(workflow)
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
      const workflow = generateBpmn();
      const saved = await client
        .post(basePath)
        .send(workflow)
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
      const workflow = generateBpmn();
      const saved = await client
        .post(basePath)
        .send(workflow)
        .set('authorization', `Bearer ${token}`);

      await client
        .post(`${basePath}/${saved.body.id}/execute`)
        .send({input: firstTestBpmnInput})
        .set('authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('gives 404 when invalid workflow id is passed', async () => {
      await client
        .post(`${basePath}/0/execute`)
        .send({input: firstTestBpmnInput})
        .set('authorization', `Bearer ${token}`)
        .expect(404);
    });

    it('gives 404 when invalid workflow version is passed', async () => {
      const workflow = generateBpmn();
      const saved = await client
        .post(basePath)
        .send(workflow)
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
      const workflow = generateBpmn();
      const saved = await client
        .post(basePath)
        .send(workflow)
        .set('authorization', `Bearer ${token}`);

      await client
        .post(`${basePath}/${saved.body.id}/execute`)
        .send({
          input: firstTestBpmnInput,
          workflowVersion: saved.body.workflowVersion,
        })
        .set('authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  async function deleteMockData() {
    await clearData();
    await workflowRepo.deleteAllHard();
    await workflowVersionRepo.deleteAll();
  }

  async function givenRepositories() {
    workflowRepo = await app.getRepository(WorkflowRepository);
    workflowVersionRepo = await app.getRepository(WorkflowVersionRepository);
    camundaService = await app.get('services.CamundaConnectorService');
  }

  async function clearData(workflows?: Workflow[]) {
    if (workflowRepo) {
      workflows =
        workflows ??
        (await workflowRepo.find({
          include: ['workflowVersions'],
        }));
      const deployments: string[] = await Promise.all(
        workflows
          .map(workflow => {
            return workflow.workflowVersions.map(version => {
              return camundaService.get<AnyObject>(version.externalWorkflowId);
            });
          })
          .flat()
          .map(p => p.then(res => res.deploymentId)),
      );
      const ids = new Set(deployments);
      for (const id of ids) {
        await camundaService.deleteDeployment(id, true).catch(() => {
          console.error(`Error deleting deployment ${id}`);
        });
      }
    }
  }
});
