import {IServiceConfig} from '@sourceloop/core';
export interface IRequestServiceConfig extends IServiceConfig {
  useRequestProvider: boolean;
}


export type ClauseProps = {
  contractFileName: string,
  extractedData?: {
          column?: string,
          columnData?: {
              value?: string | any,
              pageNum?: number | any,
              coordinates?: Object | any,
              confidenceScore?: number | any
          }
      }
}

export type OcrClause = {
  [key: string]: ClauseProps
}

export type OcrObject = {
  id: string,
  text: string,
  confidence_level: number,
  modified_by: string
}


