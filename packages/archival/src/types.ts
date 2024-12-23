import {AnyObject, Count, Filter, Options, Where} from '@loopback/repository';
import {UserModifiableEntity} from '@sourceloop/core';
import {ArchiveMapping} from './models';

/**
 * Interface defining the component's options object
 */
export interface ArchivalComponentOptions {
  // Add the definitions here
}

/**
 * Default options for the component
 */
export const DEFAULT_ARCHIVAL_OPTIONS: ArchivalComponentOptions = {
  // Specify the values here
};

export type AbstractConstructor<T> = abstract new (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[] //NOSONAR
) => T;

export type MixinBaseClass<T> = AbstractConstructor<T>;

export type ArchiveMixinBase<
  T extends UserModifiableEntity,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Relations,
> = MixinBaseClass<{
  entityClass: typeof UserModifiableEntity & {
    prototype: T;
  };
  deleteAll(where?: Where<T>, options?: ArchiveOption): Promise<Count>;
}>;

export interface IArchiveMixin {
  getCurrentUser?: () => Promise<User>;
  actorIdKey?: ActorId;
}

export interface User<ID = string, TID = string, UTID = string> {
  id?: string;
  username: string;
  password?: string;
  identifier?: ID;
  permissions: string[];
  authClientId: number;
  email?: string;
  role: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  tenantId?: TID;
  userTenantId?: UTID;
  passwordExpiryTime?: Date;
  allowedResources?: string[];
}

export type ActorId = Extract<keyof User, string>;

export interface ArchiveOption extends Options {
  skipArchive: boolean;
  actorId?: string;
}

export enum JobStatus {
  FAILED = 'Failed',
  IN_PROGRESS = 'In Progress',
  SUCCESS = 'Success',
}

export interface JobResponse {
  jobId: string;
  status?: JobStatus;
  message?: string;
}
export declare type ArchiveOptions = Options & ArchiveOption;

export type ExportDataExternalSystem = (
  entriesToArchive: AnyObject[],
) => Promise<string>;

export type ImportDataExternalSystem = (
  fileName: string,
) => Promise<AnyObject[]>;

export type ProcessRetrievedData = (
  retrievedData: AnyObject[],
) => Promise<void>;

export const ArchivalDbSourceName = 'ArchivalDB';

export interface IBuildWhereConditionService {
  buildConditionForInsert(where: AnyObject | undefined): Promise<AnyObject>;
  buildConditionForFetch(
    filter: AnyObject,
    modelName: string,
  ): Promise<Filter<ArchiveMapping>>;
}
