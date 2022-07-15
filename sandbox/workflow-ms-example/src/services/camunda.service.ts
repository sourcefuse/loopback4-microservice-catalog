// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, inject, injectable, service} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {
  IWorkflowServiceConfig,
  WorkflowServiceBindings,
} from '@sourceloop/bpmn-service';
import FormData from 'form-data';
import {HttpClientService} from './http.service';

@injectable({scope: BindingScope.TRANSIENT})
export class CamundaService {
  baseUrl: string | undefined = '';
  constructor(
    @service(HttpClientService)
    private readonly http: HttpClientService,
    @inject(WorkflowServiceBindings.Config, {optional: true})
    private readonly config: IWorkflowServiceConfig,
  ) {
    this.baseUrl = config?.workflowEngineBaseUrl;
  }

  async create<T>(name: string, file: Buffer) {
    const form = new FormData();
    form.append(`${name}.bpmn`, file.toString('utf-8'), {
      filename: `${name}.bpmn`,
    });
    form.append('deployment-name', name);
    form.append('deploy-changed-only', String(true));
    return this.http.postFormData<T>(`${this.baseUrl}/deployment/create`, form);
  }

  async delete(ids: string[]) {
    return Promise.all(
      ids.map(id =>
        this.http.delete(`${this.baseUrl}/process-definition/${id}`, {
          query: {
            cascade: true,
          },
        }),
      ),
    );
  }

  async deleteVersion(id: string) {
    return this.http.delete(`${this.baseUrl}/process-definition/${id}`);
  }

  async get<T>(id: string) {
    return this.http.get<T>(`${this.baseUrl}/process-definition/${id}`);
  }

  async execute<T>(id: string, input: AnyObject) {
    return this.http.post<T>(`${this.baseUrl}/process-definition/${id}/start`, {
      variables: this.formatInput(input),
    });
  }

  private formatInput(input: AnyObject) {
    input.customHeaders = {
      url: process.env.LOGIN_URL,
      method: 'GET',
    };
    const inputObject: AnyObject = {};
    for (const key in input) {
      inputObject[key] = {
        value:
          typeof input[key] === 'object'
            ? JSON.stringify(input[key])
            : input[key],
      };
      if (typeof input[key] === 'object') {
        inputObject[key].type = 'object';
        inputObject[key].valueInfo = {
          objectTypeName: 'java.util.LinkedHashMap',
          serializationDataFormat: 'application/json',
        };
      }
    }
    return inputObject;
  }
}
