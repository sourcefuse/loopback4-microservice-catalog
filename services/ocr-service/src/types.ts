import { IServiceConfig } from '@sourceloop/core';
export interface IRequestServiceConfig extends IServiceConfig {
  useRequestProvider: boolean;
}

export type ClauseProps = {
  contractFileName: string,
  extractedData?: {
    column?: string,
    columnData?: {
      // eslint-disable-next-line
      supportedValue: Array<string> | any,
      // eslint-disable-next-line
      value?: string | any,
      // eslint-disable-next-line 
      pageNum?: number | any,
      // eslint-disable-next-line
      coordinates?: Object | any,
      // eslint-disable-next-line
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
  confidenceLevel: number,
  modifiedBy: string
}

export const OcrDbSourceName = 'OcrDbSourceName';


