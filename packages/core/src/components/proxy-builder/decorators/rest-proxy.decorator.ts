// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {Entity} from '@loopback/repository';
import {ModelConstructor} from '../services';

export function restService(model: ModelConstructor<Entity>) {
  return inject(`services.${model.name}Proxy`);
}
