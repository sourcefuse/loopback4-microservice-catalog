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
