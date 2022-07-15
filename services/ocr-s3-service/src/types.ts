// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Readable} from 'stream';
export const OcrS3DbSourceName = 'OcrS3DbSourceName';

export declare type ObjectStorageClass =
  | 'DEEP_ARCHIVE'
  | 'GLACIER'
  | 'GLACIER_IR'
  | 'INTELLIGENT_TIERING'
  | 'ONEZONE_IA'
  | 'OUTPOSTS'
  | 'REDUCED_REDUNDANCY'
  | 'STANDARD'
  | 'STANDARD_IA';

export declare enum ChecksumAlgorithm {
  CRC32 = 'CRC32',
  CRC32C = 'CRC32C',
  SHA1 = 'SHA1',
  SHA256 = 'SHA256',
}

export interface Owner {
  DisplayName?: string;
  ID?: string;
}

export interface IListObject {
  Key?: string;
  LastModified?: Date;
  ETag?: string;
  ChecksumAlgorithm?: (ChecksumAlgorithm | string)[];
  Size?: number;
  StorageClass?: ObjectStorageClass | string;
  Owner?: Owner;
}

export declare type ServerSideEncryption = 'AES256' | 'aws:kms';

export declare type RequestCharged = 'requester';

export declare type ReplicationStatus =
  | 'COMPLETE'
  | 'FAILED'
  | 'PENDING'
  | 'REPLICA';

export declare type ObjectLockLegalHoldStatus = 'OFF' | 'ON';

export declare type ObjectLockMode = 'COMPLIANCE' | 'GOVERNANCE';

export interface GetObjectOutput {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  Body?: Readable | any; //NOSONAR
  DeleteMarker?: boolean;
  AcceptRanges?: string;
  Expiration?: string;
  Restore?: string;
  LastModified?: Date;
  ContentLength?: number;
  ETag?: string;
  ChecksumCRC32?: string;
  ChecksumCRC32C?: string;
  ChecksumSHA1?: string;
  ChecksumSHA256?: string;
  MissingMeta?: number;
  VersionId?: string;
  CacheControl?: string;
  ContentDisposition?: string;
  ContentEncoding?: string;
  ContentLanguage?: string;
  ContentRange?: string;
  ContentType?: string;
  Expires?: Date;
  WebsiteRedirectLocation?: string;
  ServerSideEncryption?: ServerSideEncryption | string;
  Metadata?: {
    [key: string]: string;
  };
  SSECustomerAlgorithm?: string;
  SSECustomerKeyMD5?: string;
  SSEKMSKeyId?: string;
  BucketKeyEnabled?: boolean;
  StorageClass?: ObjectStorageClass | string;
  RequestCharged?: RequestCharged | string;
  ReplicationStatus?: ReplicationStatus | string;
  PartsCount?: number;
  TagCount?: number;
  ObjectLockMode?: ObjectLockMode | string;
  ObjectLockRetainUntilDate?: Date;
  ObjectLockLegalHoldStatus?: ObjectLockLegalHoldStatus | string;
}
