import {get} from '@loopback/openapi-v3';
import {OperationObject} from 'openapi3-ts';
import {specPreprocessor} from './spec-preprocessor';

export function sourceloopGet(path: string, spec?: OperationObject) {
  return function (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    spec = specPreprocessor(target, propertyKey, spec);
    get(path, spec)(target, propertyKey, descriptor);
  };
}
