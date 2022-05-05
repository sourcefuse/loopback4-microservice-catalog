import { BaseEntity } from '@sourceloop/core';
export declare class OcrResults extends BaseEntity {
    id?: string;
    contractName?: string;
    clauseType?: string;
    pageNo?: number;
    text?: string;
    supportedText?: string;
    coordinates?: string;
    confidenceLevel?: number;
    constructor(data?: Partial<OcrResults>);
}
export interface OcrResultsRelations {
}
export declare type OcrResultsWithRelations = OcrResults & OcrResultsRelations;
