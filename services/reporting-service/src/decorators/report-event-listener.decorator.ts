import {ClassDecoratorFactory} from '@loopback/metadata';
import {ReportingServiceComponentBindings} from '../keys';

/**
 * The function creates a class decorator factory that binds a record type to a reporting service event
 * listener metadata.
 * @param {string} recordType - The `recordType` parameter is a string that represents the type of
 * record.
 * @returns a decorator created by the `ClassDecoratorFactory.createDecorator` method.
 */
export function handleRecordType(recordType: string) {
  return ClassDecoratorFactory.createDecorator(
    ReportingServiceComponentBindings.REPORT_EVENT_LISTENER_METADATA,
    {
      recordType: recordType,
    },
  );
}
