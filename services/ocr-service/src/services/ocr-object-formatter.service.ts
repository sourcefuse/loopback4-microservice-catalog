import {injectable, BindingScope} from '@loopback/core';
import { v4 as uuidv4 } from 'uuid';
import { OcrClause } from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class OcrObjectFormatterService {
  constructor() {}

  async format(res: any) {
    const resp: OcrClause = res;
    const clause_type: string = Object.keys(resp)[0];
    const formattedObject = {
        contract_name: resp[clause_type].contractFileName,
        clause_type: resp[clause_type]?.extractedData?.column,
        page_number: resp[clause_type]?.extractedData?.columnData?.pageNum,
        text: resp[clause_type]?.extractedData?.columnData?.value,
        coordinates: resp[clause_type]?.extractedData?.columnData?.coordinates ? JSON.stringify(resp[clause_type]?.extractedData?.columnData?.coordinates): null,
        confidence_level: resp[clause_type]?.extractedData?.columnData?.confidenceScore,
        created_by: uuidv4(),
        modified_by: uuidv4()
    }

    return formattedObject
}
}
