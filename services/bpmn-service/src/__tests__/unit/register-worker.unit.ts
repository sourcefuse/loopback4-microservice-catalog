﻿// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {expect} from '@loopback/testlab';
import {WorkerRegisterFnProvider} from '../../providers/register-worker.service';
import {BPMTask, WorkerMap} from '../../types';

describe('RegisterWorker unit', () => {
  let map: WorkerMap = {};
  const getterStub = async () => map;
  const setterStub = (value: AnyObject) => {
    map = value;
  };

  beforeEach(() => {
    map = {};
    setterStub({});
  });

  it('sets a worker value in a map againts a workflow name', async () => {
    const registerWorker = new WorkerRegisterFnProvider(
      getterStub,
      setterStub,
    ).value();
    const task1 = new BPMTask<AnyObject, AnyObject>();
    const task2 = new BPMTask<AnyObject, AnyObject>();
    const task3 = new BPMTask<AnyObject, AnyObject>();
    const task4 = new BPMTask<AnyObject, AnyObject>();
    const workerMap = {
      workflow1: [
        {
          command: task1,
          running: false,
          topic: 'topic1',
          isInProgress: false,
        },
        {
          command: task2,
          running: false,
          topic: 'topic2',
          isInProgress: false,
        },
      ],
      workflow2: [
        {
          command: task3,
          running: false,
          topic: 'topic3',
          isInProgress: false,
        },
        {
          command: task4,
          running: false,
          topic: 'topic4',
          isInProgress: false,
        },
      ],
    };
    await registerWorker('workflow1', 'topic1', task1);
    await registerWorker('workflow1', 'topic2', task2);
    await registerWorker('workflow2', 'topic3', task3);
    await registerWorker('workflow2', 'topic4', task4);

    expect(map).to.deepEqual(workerMap);
  });
});
