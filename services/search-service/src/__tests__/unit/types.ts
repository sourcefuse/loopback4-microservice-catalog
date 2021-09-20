import {DataObject} from '@loopback/repository';
import {SearchQuery} from '../../models';
import {HttpError} from 'http-errors';
import {Errors} from '../../const';

export type BuilderTest = {
  params: Omit<DataObject<SearchQuery>, 'match'>;
  it: string;
  expects?: string;
  error?: typeof HttpError;
  message?: Errors;
};
