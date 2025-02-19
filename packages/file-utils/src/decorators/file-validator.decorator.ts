import {injectable} from '@loopback/core';
import {asFileValidator} from '../keys';

export function fileValidator() {
  return injectable(asFileValidator);
}
