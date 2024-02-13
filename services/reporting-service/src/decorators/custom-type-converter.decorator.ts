import {ClassDecoratorFactory} from '@loopback/metadata';
import {ReportingServiceComponentBindings} from '../keys';

/**
 * The function `CustomTypeConverterDecorator` creates a decorator for a custom type converter with the
 * specified convertType.
 * @param {string} convertType - The `convertType` parameter is a string that represents the type that
 * needs to be converted.
 * @returns a decorator created by the `ClassDecoratorFactory.createDecorator` method. The decorator is
 * created with the `ReportingServiceComponentBindings.CUSTOM_TYPE_CONVERTER_METADATA` as the first
 * argument and an object with the `convertType` property set to the `convertType` parameter as the
 * second argument.
 */
export function customTypeConversion(convertType: string) {
  return ClassDecoratorFactory.createDecorator(
    ReportingServiceComponentBindings.CUSTOM_TYPE_CONVERTER_METADATA,
    {
      convertType: convertType,
    },
  );
}
