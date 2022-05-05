import { BaseEntity } from '@sourceloop/core';
export declare class Contracts extends BaseEntity {
    id?: string;
    contractName: string;
    contractUploaded?: boolean;
    imageConverted?: boolean;
    ocrConverted?: boolean;
    hocrConverted?: boolean;
    constructor(data?: Partial<Contracts>);
}
export interface ContractsRelations {
}
export declare type ContractsWithRelations = Contracts & ContractsRelations;
