// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AnyObject} from '@loopback/repository';

export type HttpOptions = {
  query?: AnyObject;
  urlParams?: AnyObject;
  headers?: AnyObject;
};
