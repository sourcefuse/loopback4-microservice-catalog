// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {WorkflowDto} from '../models';
import {MockCamundaWorkflow} from './types';

export class MockEngine {
  workflowList: {
    [id: string]: {
      [version: number]: MockCamundaWorkflow;
    };
  } = {};
  subscriptions: {
    [topic: string]: (data: AnyObject, finish: () => void) => void;
  } = {};

  instances: {
    [name: string]: {
      topics: {
        topic: string;
        done: boolean;
      }[];
      complete: boolean;
    };
  } = {};

  create(workflow: WorkflowDto) {
    const workflowPrevList = this.workflowList[workflow.name];
    let version = 0;
    if (workflowPrevList) {
      version = Object.keys(workflowPrevList).length;
      workflowPrevList[version] = {
        workflowVersion: version,
        externalIdentifier: workflow.name,
        name: workflow.name,
        provider: 'bpmn',
        inputSchema: workflow.inputSchema,
        workflowVersions: [],
        file: workflow.bpmnFile,
      };
    } else {
      this.workflowList[workflow.name] = {
        [version]: {
          workflowVersion: version,
          externalIdentifier: workflow.name,
          name: workflow.name,
          provider: 'bpmn',
          inputSchema: workflow.inputSchema,
          workflowVersions: [],
          file: workflow.bpmnFile,
        },
      };
    }
    return this.workflowList[workflow.name][version];
  }

  update(workflow: WorkflowDto) {
    if (this.workflowList?.[workflow.name]) {
      const latest = Math.max(
        ...Object.keys(this.workflowList[workflow.name]).map(s => Number(s)),
      );
      this.workflowList[workflow.name][latest + 1] = {
        workflowVersion: latest + 1,
        externalIdentifier: workflow.name,
        name: workflow.name,
        provider: 'bpmn',
        inputSchema: workflow.inputSchema,
        workflowVersions: [],
        file: workflow.bpmnFile,
      };
      return this.workflowList[workflow.name][latest + 1];
    } else {
      throw new HttpErrors.NotFound('Not Found');
    }
  }

  get(name: string, version?: number) {
    if (version) {
      if (this.workflowList?.[name]?.[version]) {
        return this.workflowList[name][version];
      } else {
        throw new HttpErrors.NotFound('Not Found');
      }
    } else {
      if (this.workflowList?.[name]) {
        const latest = Object.keys(this.workflowList?.[name]).length - 1;
        if (latest > -1) {
          return this.workflowList[name][latest];
        } else {
          throw new HttpErrors.NotFound('Not Found');
        }
      } else {
        throw new HttpErrors.NotFound('Not Found');
      }
    }
  }

  delete(name: string) {
    if (this.workflowList?.[name]) {
      const latest = Math.max(
        ...Object.keys(this.workflowList[name]).map(s => Number(s)),
      );
      const workflowBackup = this.workflowList[name][latest];
      delete this.workflowList[name];
      return workflowBackup;
    } else {
      throw new HttpErrors.NotFound('Not Found');
    }
  }

  deleteVersion(name: string, version: number) {
    if (this.workflowList?.[name]?.[version]) {
      delete this.workflowList[name][version];
    } else {
      throw new HttpErrors.NotFound('Not Found');
    }
  }

  clear() {
    this.workflowList = {};
  }

  async start(input: AnyObject, name: string, version?: number) {
    const workflow = this.get(name, version);
    const topics = JSON.parse(workflow.file) as string[];
    this.instances[workflow.name] = {
      topics: topics.map(t => ({topic: t, done: false})),
      complete: false,
    };
    this.triggerTask(name, topics[0], input);
    return workflow;
  }

  subscribe(topic: string, cb: (data: AnyObject, finish: () => void) => void) {
    this.subscriptions[topic] = cb;
  }

  triggerTask(name: string, topic: string, data: AnyObject) {
    const finish = () => {
      const instance = this.instances[name];
      const current = instance.topics.find(t => t.topic === topic);
      if (current) {
        current.done = true;
      } else {
        instance.complete = true;
      }
      const next = instance.topics.find(t => !t.done);
      if (next && !instance.complete) {
        this.triggerTask(name, next.topic, data);
      } else {
        instance.complete = true;
      }
    };
    this.subscriptions[topic](data, finish);
  }
}
