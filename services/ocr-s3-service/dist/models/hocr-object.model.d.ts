import { BaseEntity } from '@sourceloop/core';
export declare class HocrObject extends BaseEntity {
    id?: string;
    contractName?: string;
    type?: string;
    pageNo?: number;
    hocrData?: string;
    imgData?: string;
    constructor(data?: Partial<HocrObject>);
}
export interface HocrObjectRelations {
}
export declare type HocrObjectWithRelations = HocrObject & HocrObjectRelations;
