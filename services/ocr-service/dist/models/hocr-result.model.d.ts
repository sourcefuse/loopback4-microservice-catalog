import { BaseEntity } from '@sourceloop/core';
export declare class HocrResults extends BaseEntity {
    id?: string;
    contractName: string;
    type: string;
    pageNo: number;
    hocrData?: string;
    imgData?: string;
    constructor(data?: Partial<HocrResults>);
}
export interface HocrResultsRelations {
}
export declare type HocrResultsWithRelations = HocrResults & HocrResultsRelations;
