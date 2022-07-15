// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export interface Variable {
  [key: string]: {
    value: string;
    type: string;
    valueInfo?: {
      objectTypeName: string;
      serializationDataFormat: string;
      transient: boolean;
    };
  };
}
