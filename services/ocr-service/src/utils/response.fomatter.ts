import { OcrClause } from '../types';

export interface ResponseHander < T = object > {
    format(resp: T): Promise < T > ;
}


export class ResponseFormat implements ResponseHander < object > {
    async format(res: any) {
        console.log(JSON.stringify(res));
        const resp: OcrClause = res;
        const clause_type: string = Object.keys(resp)[0];
        const formattedObject = {
            contract_name: resp[clause_type].contractFileName,
            clause_type: clause_type,
            page_number: isNaN(resp[clause_type].extractedData.columnData.PageNum) ? null : resp[clause_type].extractedData.columnData.PageNum,
            text: resp[clause_type].extractedData.columnData.value,
            coordinates: resp[clause_type].extractedData.columnData.coordinates ? JSON.stringify(resp[clause_type].extractedData.columnData.coordinates): null,
            confidence_level: resp[clause_type].extractedData.columnData.confidenceScore,
            created_by: '1759d245-d3c4-4325-b770-4078ed7250b2',
            modified_by: '1759d245-d3c4-4325-b770-4078ed7250b2'
        }

        return formattedObject
    }
}