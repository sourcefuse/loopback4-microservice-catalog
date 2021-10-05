import {inject, injectable} from '@loopback/core';
import {asSpecEnhancer, OASEnhancer, OpenApiSpec} from '@loopback/rest';
import {OASBindings, OasHiddenApi} from '../services/enhancer-keys';

/**
 * A spec enhancer to modify paths
 */
@injectable(asSpecEnhancer)
export class OperationSpecEnhancer implements OASEnhancer {
  name = 'info';
  constructor(
    @inject(OASBindings.HiddenEndpoint) private readonly hidden: OasHiddenApi[],
  ) {}
  // takes in the current spec, modifies it, and returns a new one
  modifySpec(spec: OpenApiSpec): OpenApiSpec {
    const paths = spec.paths;

    const arrayApiSearch = Object.entries(this.hidden);

    console.log(arrayApiSearch[0][1]['path']);

    arrayApiSearch.forEach(apiSearch => {
      for (const path in paths) {
        if (path === apiSearch[1]['path']) {
          if (paths[path]['get'] && apiSearch[1]['httpMethod'] === 'GET') {
            console.log(paths[path]['get']);
            delete paths[path]['get'];
          }

          if (paths[path]['post'] && apiSearch[1]['httpMethod'] === 'POST') {
            console.log(paths[path]['post']);
            delete paths[path]['post'];
          }

          if (paths[path]['patch'] && apiSearch[1]['httpMethod'] === 'PATCH') {
            console.log(paths[path]['patch']);
            delete paths[path]['patch'];
          }

          if (
            paths[path]['delete'] &&
            apiSearch[1]['httpMethod'] === 'DELETE'
          ) {
            console.log(paths[path]['delete']);
            delete paths[path]['delete'];
          }

          if (paths[path]['put'] && apiSearch[1]['httpMethod'] === 'PUT') {
            console.log(paths[path]['put']);
            delete paths[path]['put'];
          }
        }
      }
      console.log(apiSearch[1]['path']);
    });

    return spec;
  }
}
