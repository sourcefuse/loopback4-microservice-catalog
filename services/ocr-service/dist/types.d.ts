import { IServiceConfig } from '@sourceloop/core';
export interface IRequestServiceConfig extends IServiceConfig {
    useRequestProvider: boolean;
}
export declare type ClauseProps = {
    contractFileName: string;
    extractedData?: {
        column?: string;
        columnData?: {
            supportedValue: Array<string> | any;
            value?: string | any;
            pageNum?: number | any;
            coordinates?: Object | any;
            confidenceScore?: number | any;
        };
    };
};
export declare type OcrClause = {
    [key: string]: ClauseProps;
};
export declare type OcrObject = {
    id: string;
    text: string;
    confidenceLevel: number;
    modifiedBy: string;
};
export declare const OcrDbSourceName = "OcrDb";
