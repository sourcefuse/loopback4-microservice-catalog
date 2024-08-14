// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Constructor, Provider} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {Request} from '@loopback/rest';
import multer from 'multer';

export type ParsedMultipartData = {
  files: Request['files'];
  file: Request['file'];
  body: AnyObject;
};

export type File = Express.Multer.File;

export type S3File = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  contentDisposition: null;
  contentEncoding: null;
  storageClass: string;
  serverSideEncryption: null;
  metadata: Metadata;
  location: string;
  etag: string;
};

export interface Metadata {
  fieldName: string;
}

export type IFileRequestMetadata<T = AnyObject> = {
  extensions: string[];
  storageOptions?: IFileStorageOptions<T>;
};

export type IFileStorageOptions<T> = {
  storageClass: Constructor<Provider<multer.StorageEngine>>;
  options?: T;
};

export type S3StorageOptions = {
  bucket: string;
};

export interface IFileValidator {
  validate(file: File): Promise<void>;
}
