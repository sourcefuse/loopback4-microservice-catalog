import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
  sinon,
} from '@loopback/testlab';
import {IWorkflowServiceConfig} from '@sourceloop/bpmn-service';
import {CamundaService, HttpClientService} from '../../services';

describe('CamundaService: Unit', () => {
  let service: CamundaService;
  let httpClientService: StubbedInstanceWithSinonAccessor<HttpClientService>;
  let config: IWorkflowServiceConfig;
  const camundaUrl = 'http://localhost:8080';

  beforeEach(() => {
    httpClientService = createStubInstance(HttpClientService);
    config = {
      workflowEngineBaseUrl: camundaUrl,
      useCustomSequence: false,
    };
    service = new CamundaService(httpClientService, config);
  });

  it('should complete user task', async () => {
    const id = '123';
    const variables = {
      test: 'test',
    };
    await service.completeUserTask(id, variables);
    sinon.assert.calledOnceWithExactly(
      httpClientService.stubs.post,
      `${camundaUrl}/task/${id}/complete`,
      {variables},
    );
  });

  it('should get pending user tasks', async () => {
    const id = '123';
    await service.getPendingUserTasks(id);

    sinon.assert.calledOnceWithExactly(
      httpClientService.stubs.get,
      `${camundaUrl}/task?processInstanceId=${id}`,
    );
  });

  it('should create', async () => {
    const name = 'test';
    const file = Buffer.from('test');
    await service.create(name, file);
    sinon.assert.calledOnce(httpClientService.stubs.postFormData);
    expect(httpClientService.stubs.postFormData.getCalls()[0].args[0]).to.equal(
      `${camundaUrl}/deployment/create`,
    );
  });

  it('should delete', async () => {
    const id = '123';
    await service.delete([id]);
    sinon.assert.calledOnceWithExactly(
      httpClientService.stubs.delete,
      `${camundaUrl}/process-definition/${id}`,
      {
        query: {
          cascade: true,
        },
      },
    );
  });

  it('should delete version', async () => {
    const id = '123';
    await service.deleteVersion(id);

    sinon.assert.calledOnceWithExactly(
      httpClientService.stubs.delete,
      `${camundaUrl}/process-definition/${id}`,
    );
  });

  it('should get process definition', async () => {
    const id = '123';
    await service.get(id);

    sinon.assert.calledOnceWithExactly(
      httpClientService.stubs.get,
      `${camundaUrl}/process-definition/${id}`,
    );
  });

  it('should start a process', async () => {
    const id = '123';
    const variables = {
      test: 'test',
    };
    await service.execute(id, variables);
    sinon.assert.calledOnceWithExactly(
      httpClientService.stubs.post,
      `${camundaUrl}/process-definition/${id}/start`,
      // structure build by the camunda service for execute input
      {
        variables: {
          test: {value: variables.test},
          customHeaders: {
            value: JSON.stringify({
              method: 'GET',
            }),
            type: 'object',
            valueInfo: {
              objectTypeName: 'java.util.LinkedHashMap',
              serializationDataFormat: 'application/json',
            },
          },
        },
      },
    );
  });
});
