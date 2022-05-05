import { OcrClause } from '../types';
export declare class OcrObjectFormatterService {
    constructor();
    format(res: OcrClause): Promise<{
        contractName: string;
        clauseType: string | undefined;
        pageNumber: any;
        text: any;
        supportedText: any;
        coordinates: string | null;
        confidenceLevel: any;
    }>;
}
