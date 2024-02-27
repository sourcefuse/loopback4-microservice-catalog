export type DataTypeConversionOptions = {
  dateFormat?: string; // Format for date conversion
  numberPrecision?: number; // Precision for number conversion
  booleanTrueValues?: string[]; // Values to be considered as true for boolean conversion
  arrayWrapSingle?: boolean; // Whether to wrap single values in an array
  strictParsing?: boolean; // Enable strict parsing for JSON objects
  isNullable?: boolean; // Indicates if null values are acceptable
  isMandatory?: boolean; // Indicates if the value is required (cannot be undefined)
};
