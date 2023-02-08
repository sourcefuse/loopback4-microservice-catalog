import * as AWS from 'aws-sdk';
import {Request, Response} from 'express';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageData = {rows: any[]; types: Record<string, string>[]};
export interface SaveDataFn {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (error: any, bucket?: string) => void,
      ) => void)
    | string;
  key?(
    req: Request,
    file: File,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (error: any, key: string) => void,
  ): void;
  acl?:
    | ((
        req: Request,
        file: File,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (error: any, acl?: string) => void,
      ) => void)
    | string;
  // contentType?(
  //   req: Request,
  //   file: File,
  //   callback: (
  //     error: any,
  //     mime?: string,
  //     stream?: NodeJS.ReadableStream,
  //   ) => void,
  // ): void;
  metadata?(
    req: Request,
    file: File,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (error: any, metadata?: any) => void,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (err: any, allow?: boolean) => void,
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
  // tempDir: string;
  // noServerUpload?: boolean;
}
