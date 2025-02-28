// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {expect} from '@loopback/testlab';
import {ICommand, ILogger} from '@sourceloop/core';
import {Client} from 'camunda-external-task-client-js';
import sinon from 'sinon';
import {WorkerImplementationProvider} from '../../providers/worker-implementation.provider';
import {BPMTask, IWorkflowServiceConfig, WorkerNameCmdPair} from '../../types';

describe('WorkerImplementationProvider Unit Tests', () => {
  let worker: WorkerNameCmdPair;
  let provider: WorkerImplementationProvider;
  let mockClient: sinon.SinonStubbedInstance<Client>;
  let mockLogger: sinon.SinonStubbedInstance<ILogger>;
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    // Mock Logger
    mockLogger = {
      info: sinon.stub(),
      error: sinon.stub(),
      warn: sinon.stub(),
      debug: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<ILogger>;

    // Mock Workflow Service Config
    const config: IWorkflowServiceConfig = {
      useCustomSequence: true,
      workflowEngineBaseUrl: 'http://localhost:8080',
    };

    // Mock Camunda Client
    mockClient = sinon.createStubInstance(Client);
    sinon.stub(Client.prototype, 'subscribe').callsFake((_topic, callback) => {
      callback({
        task: {
          variables: {
            get: sinon.stub(),
            getTyped: sinon.stub(),
            getAll: sinon.stub(),
            getAllTyped: sinon.stub(),
            set: sinon.stub(),
            setTyped: sinon.stub(),
            setAll: sinon.stub(),
            setAllTyped: sinon.stub(),
          },
        },
        taskService: {
          complete: sinon.stub(),
          handleFailure: sinon.stub(),
          handleBpmnError: sinon.stub(),
          extendLock: sinon.stub(),
          unlock: sinon.stub(),
        },
      });
      return {unsubscribe: sinon.stub()};
    });

    // Use fake timers to control setTimeout/setInterval
    clock = sinon.useFakeTimers();

    provider = new WorkerImplementationProvider(config, mockLogger);

    const mockCommand: ICommand = {
      parameters: {},
      execute: sinon.stub().resolves({}), // Mock execute() to return a resolved promise
    };

    // Initialize Worker
    worker = {
      topic: 'test-topic',
      command: new BPMTask<AnyObject, AnyObject>(mockCommand),
      running: false,
      isInProgress: false,
    };
  });

  afterEach(() => {
    clock.restore();
    sinon.restore();
  });

  it('should initialize worker with isInProgress as false', async () => {
    const implementationFn = provider.value();
    await implementationFn(worker);
    expect(worker.isInProgress).to.be.false();
  });

  it('should set isInProgress to true when processing starts', async () => {
    const implementationFn = provider.value();

    // Ensure `worker.isInProgress` starts as false
    expect(worker.isInProgress).to.be.false();

    // Modify existing stub instead of re-stubbing
    (worker.command.command.execute as sinon.SinonStub).callsFake(async () => {
      // verify isInProgress is true during worker execution flow
      expect(worker.isInProgress).to.be.true();
      return {};
    });

    await implementationFn(worker);
  });

  it('should return early if worker is already in progress', async () => {
    worker.isInProgress = true;
    provider.client = mockClient as unknown as Client;

    const implementationFn = provider.value();
    await implementationFn(worker);

    const operationStub = sinon.stub(worker.command, 'operation');
    await implementationFn(worker);

    expect(operationStub.called).to.be.false();
  });

  it('should set isInProgress to false when task completes', async () => {
    const implementationFn = provider.value();
    await implementationFn(worker);

    // Properly stub the 'operation' method
    const operationStub = sinon.stub(worker.command, 'operation');

    // Simulate task completion by invoking the callback with an empty object
    operationStub.callsFake((_data, done) => {
      if (done) done({});
    });

    expect(worker.isInProgress).to.be.false();

    // Restore the stub after the test
    operationStub.restore();
  });

  it('should set isInProgress to false if an error occurs during polling', async () => {
    sinon.restore();
    const onStub = sinon
      .stub(mockClient, 'on')
      .callsArgWith(1, new Error('Test Poll Error'));

    const implementationFn = provider.value();
    await implementationFn(worker);

    // Simulate poll error
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (provider.client as any).emit(
      'poll:error',
      new Error('Simulated Polling Error'),
    );

    expect(worker.isInProgress).to.be.false();
    expect(worker.running).to.be.false();

    onStub.restore();
  });
});
