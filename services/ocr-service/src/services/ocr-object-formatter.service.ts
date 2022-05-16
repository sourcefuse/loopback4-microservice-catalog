import {injectable, BindingScope} from '@loopback/core';
import {OcrClause} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class OcrObjectFormatterService {
  constructor() {}

  async format(res: OcrClause) {
    const resp: OcrClause = res;
    const clauseTypeData: string = Object.keys(resp)[0];
    const formattedObject = {
      contractName: resp[clauseTypeData].contractFileName,
      clauseType: resp[clauseTypeData].extractedData.column,
      pageNumber: resp[clauseTypeData].extractedData.columnData.pageNum,
      text: resp[clauseTypeData].extractedData.columnData.value,
      supportedText: resp[clauseTypeData].extractedData.columnData
        .supportedValue
        ? JSON.stringify(
            resp[clauseTypeData].extractedData.columnData.supportedValue,
          )
        : null,
      coordinates: resp[clauseTypeData].extractedData.columnData.coordinates
        ? JSON.stringify(
            resp[clauseTypeData].extractedData.columnData.coordinates,
          )
        : null,
      confidenceLevel:
        resp[clauseTypeData].extractedData.columnData.confidenceScore,
    };

    return formattedObject;
  }
}
