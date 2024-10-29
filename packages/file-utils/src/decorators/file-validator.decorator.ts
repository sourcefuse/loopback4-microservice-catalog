// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {injectable} from '@loopback/core';
import {asFileValidator} from '../keys';

/**
 * Decorator function that marks and registers a class as a file validator.
 * This decorator is used to inject the class as a file validator using the `injectable` and `asFileValidator` functions.
 *
 * @returns {Function} The decorated class as a file validator.
 */
export function fileValidator() {
  return injectable(asFileValidator);
}
