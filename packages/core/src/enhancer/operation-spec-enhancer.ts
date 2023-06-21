// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {apiHide} from './utility';
import {inject, injectable} from '@loopback/core';
import {asSpecEnhancer, OASEnhancer, OpenApiSpec} from '@loopback/rest';
import {OASBindings, OasHiddenApi} from '../keys';

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
    apiHide(arrayApiSearch, paths);
    return spec;
  }
}
