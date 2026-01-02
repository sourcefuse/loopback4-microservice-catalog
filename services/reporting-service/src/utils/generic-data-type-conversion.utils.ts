import {AnyObject} from '@loopback/repository';
import {DataTypeConversionOptions} from '../enums';
import {
  DataStoreDataTypeConversionFunctions,
  JSONValueType,
} from '../interfaces';

export class GenericConversionUtils implements DataStoreDataTypeConversionFunctions {
  convertToString(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): string {
    this.checkNullAndMandatory(value, options);
    if (value === null) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
  }

  convertToNumber(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): number {
    this.checkNullAndMandatory(value, options);
    if (value === null) return 0;
    const formattedValue =
      typeof value === 'string' ? value.replace(/[$,]/g, '').trim() : value;
    const number = Number(formattedValue);
    if (isNaN(number))
      throw new Error(`Cannot convert to number: ${JSON.stringify([value])}`);
    return number;
  }

  convertToBoolean(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): boolean {
    this.checkNullAndMandatory(value, options);
    if (value === null) return false;
    if (typeof value === 'string') {
      const trueValues = options?.booleanTrueValues ?? ['true', '1', 'yes'];
      return trueValues.includes(value.toLowerCase());
    }
    return Boolean(value);
  }

  convertToDate(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): string {
    this.checkNullAndMandatory(value, options);
    if (value === null) return '';

    // Ensure value is a type that the Date constructor accepts (string, number, or Date)
    let dateInput: string | number | Date;
    if (typeof value === 'string' || typeof value === 'number') {
      dateInput = value;
    } else if (value instanceof Date) {
      dateInput = value;
    } else {
      throw new Error(
        `Cannot convert to date: Unsupported type for value  ${JSON.stringify([
          value,
        ])}`,
      );
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) throw new Error(`Invalid date: ${value}`);
    return options?.dateFormat
      ? this.formatDate(date, options.dateFormat)
      : date.toISOString();
  }

  convertToArray(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): AnyObject[] {
    this.checkNullAndMandatory(value, options);
    if (value === null) return [];
    return Array.isArray(value) ? value : [value as AnyObject];
  }

  convertToObject(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): AnyObject {
    this.checkNullAndMandatory(value, options);
    if (value === null) return {};
    if (typeof value === 'string' && options?.strictParsing) {
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new Error(`Invalid JSON string: ${e.message}`);
      }
    }
    if (typeof value === 'object') return value;
    throw new Error(`Cannot convert to object: ${value}`);
  }

  private checkNullAndMandatory(
    value: JSONValueType,
    options?: DataTypeConversionOptions,
  ): void {
    if (value === null && !options?.isNullable) {
      throw new Error('Value is null but not marked as nullable.');
    }
    if (value === undefined && options?.isMandatory) {
      throw new Error('Value is mandatory but was not provided.');
    }
  }
  private formatDate(date: Date, format: string): string {
    // Placeholder for date formatting logic
    return date.toISOString(); // Replace with actual formatting logic
  }
}
