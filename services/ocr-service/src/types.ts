import {IServiceConfig} from '@sourceloop/core';
export interface IRequestServiceConfig extends IServiceConfig {
  useRequestProvider: boolean;
}


export type ClauseProps = {
  contractFileName: string,
  extractedData: {
          Column: string,
          columnData: {
              value: string | any,
              PageNum: number | any,
              coordinates: Object | any,
              confidenceScore: number | any
          }
      }
}

export type OcrClause = {
  [key: string]: ClauseProps
}


