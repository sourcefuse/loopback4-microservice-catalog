// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {DataObject} from '@loopback/repository';
import {SearchQuery} from '../../models';
import {Errors} from '../../const';
import {HttpErrors} from '@loopback/rest';

export type BuilderTest = {
  params: Omit<DataObject<SearchQuery>, 'match'>;
  it: string;
  expects?: string;
  error?: typeof HttpErrors.HttpError;
  message?: Errors;
};
