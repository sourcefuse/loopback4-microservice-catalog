import {Constructor, Provider} from '@loopback/core';
import {AnyObject, PropertyDefinition} from '@loopback/repository';
import {Request} from '@loopback/rest';
import multer from 'multer';

export type ParsedMultipartData = {
  files?: Request['files'];
  file?: Request['file'];
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

export type IBaseMetadata<T> = {
  extensions?: string[];
  storageOptions?: IFileStorageOptions<T>;
  validators?: Constructor<IFileValidator>[];
};

export type IModelWithFileMetadata<T = AnyObject> = {
  definition: {
    [key: string]: PropertyDefinition & IFileRequestMetadata<T>;
  };
  multerConfig?: {limitsProvider: boolean};
};

export type IFileRequestMetadata<T = AnyObject> =
  | IBaseMetadata<T>
  | IModelWithFileMetadata<T>;

export function getConfigProperty<T, S extends keyof IBaseMetadata<T>>(
  config: IFileRequestMetadata<T>,
  property: S,
  file: Express.Multer.File,
): IBaseMetadata<T>[S] {
  if (isMultipartModelMetadata(config)) {
    return config.definition[file.fieldname][property];
  } else {
    return config[property];
  }
}

export function isMultipartModelMetadata<T>(
  config: IFileRequestMetadata<T>,
): config is IModelWithFileMetadata<T> {
  return !!(config as IModelWithFileMetadata<T>).definition;
}

export type IFileStorageOptions<T> = {
  storageClass: Constructor<Provider<multer.StorageEngine>>;
  options?: T;
};

export type S3StorageOptions = {
  bucket: string;
};

export interface IFileValidator {
  validate(file: File): Promise<File>;
}

export type FileValidatorWithConstructor = IFileValidator & {
  constructor: Constructor<IFileValidator>;
};

export type MulterConfig = {
  limits: AnyObject;
  configFor: <T, S extends keyof IBaseMetadata<T>>(
    property: S,
    file: Express.Multer.File,
  ) => IBaseMetadata<T>[S];
};

export interface IFileLimitsGetter {
  get: () => Promise<MulterUploadOptions>;
}

export type MulterUploadOptions<T = AnyObject> = Partial<
  IModelWithFileMetadata<T>
> & {
  sizeLimits?: multer.Options['limits'];
};

export interface IConfigGetter {
  value: () => Promise<MulterUploadOptions<AnyObject>>;
}
