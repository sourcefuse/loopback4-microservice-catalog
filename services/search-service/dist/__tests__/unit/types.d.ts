/// <reference types="http-errors" />
import { DataObject } from '@loopback/repository';
import { SearchQuery } from '../../models';
import { Errors } from '../../const';
import { HttpErrors } from '@loopback/rest';
export declare type BuilderTest = {
    params: Omit<DataObject<SearchQuery>, 'match'>;
    it: string;
    expects?: string;
    error?: typeof HttpErrors.HttpError;
    message?: Errors;
};
