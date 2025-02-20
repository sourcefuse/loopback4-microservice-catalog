import {injectable} from '@loopback/core';
import {asFileValidator} from '../keys';

/**
 * A decorator function that registers a class as a file validator.
 *
 * This function uses the `injectable` decorator to mark the class
 * as a file validator, allowing it to be injected and used within
 * the application.
 *
 * @returns {Function} The decorator function that registers the class as a file validator.
 */
export function fileValidator() {
  return injectable(asFileValidator);
}
