import * as AWS from 'aws-sdk';
import {Request, Response} from 'express';
export type MessageData = {rows: string[]; types: Record<string, string>[]};
export interface SaveUserDataFn {
  (data: MessageData): Promise<Object | null>;
}
export interface IUploader {
  uploadAny(
    options: MulterS3Options,
    req: Request,
    res: Response,
  ): Promise<object>;
}
export interface MulterS3Options {
  s3: AWS.S3;
  // sonarignore:start
  bucket:
    | ((
        req: Request,
        file: File,
        callback: (error: Error, bucket?: string) => void,
      ) => void)
    | string;
  key?(
    req: Request,
    file: File,
    callback: (error: Error, key: string) => void,
  ): void;
  acl?:
    | ((
        req: Request,
        file: File,
        callback: (error: Error, acl?: string) => void,
      ) => void)
    | string;

  metadata?(
    req: Request,
    file: File,
    callback: (error: Error, metadata?: Object) => void,
  ): void;
  // sonarignore:end
}
export interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}
export interface SafeMulterS3Options
  extends Omit<MulterS3Options, 'contentType'> {
  maxSize?: number;
  allowedExts?: string[];
  fileFilter?: (
    req: Request,
    file: File,
    // sonarignore:start
    callback: (err: Error, allow?: boolean) => void,
    // sonarignore:end
  ) => void;
  key: (
    req: Request,
    file: File,
    // sonarignore:start
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (error: any, key: string) => void,
    // sonarignore:end
  ) => void;
  acl?: string;
  bucket: string;
}
