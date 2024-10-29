import {inject} from '@loopback/core';
import {HttpErrors, get, param} from '@loopback/rest';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKeys} from '../enums';
import {StateTracking} from '../models';
import {StateTrackingService} from '../services';
/* The `StateTrackingController` class is a TypeScript class that handles HTTP requests related to
state tracking records, including finding the latest record, finding all records, and counting
records. */
export class StateTrackingController {
  constructor(
    @inject('services.StateTrackingService')
    private readonly stateTrackingService: StateTrackingService,
  ) {}
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.DeleteIngestionMappings]})
  @get('/state-tracking/latest/{recordType}', {
    responses: {
      '200': {
        description: 'Find latest StateTracking by recordType',
        content: {'application/json': {schema: {'x-ts-type': StateTracking}}},
      },
    },
  })

  /**
   * The function `findLatestRecord` retrieves the latest record of a given type and ID, and throws an
   * error if no record is found.
   * @param {string} recordType - The `recordType` parameter is a string that represents the type of
   * record you want to find the latest version of.
   * @param {string} [recordId] - The `recordId` parameter is an optional string parameter that
   * represents the ID of the record. It is used to filter the search for the latest record based on
   * its ID. If no `recordId` is provided, the search will return the latest record of the specified
   * `recordType` without any
   * @returns a Promise that resolves to either a StateTracking object or null.
   */
  async findLatestRecord(
    @param.path.string('recordType') recordType: string,
    @param.query.string('recordId') recordId?: string,
  ): Promise<StateTracking | null> {
    const result = await this.stateTrackingService.findLatestRecord(
      recordType,
      recordId,
    );
    if (result === null) {
      throw new HttpErrors.NotFound(
        `No record found for type: ${recordType}, ID: ${recordId}`,
      );
    }
    return result;
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.DeleteIngestionMappings]})
  @get('/state-tracking/all/{recordType}', {
    responses: {
      '200': {
        description: 'Find all StateTracking by recordType',
        content: {'application/json': {schema: {'x-ts-type': StateTracking}}},
      },
    },
  })

  /**
   * The `findAllRecords` function takes in parameters such as `recordType`, `skip`, `limit`, and
   * `recordId` and returns a promise that resolves to an array of `StateTracking` objects.
   * @param {string} recordType - The `recordType` parameter is a string that specifies the type of
   * records to be retrieved. It is a required parameter and must be provided in the path of the
   * request URL.
   * @param {number} [skip] - The `skip` parameter is used to specify the number of records to skip
   * before returning the results. It is an optional parameter and if not provided, it defaults to 0.
   * @param {number} [limit] - The `limit` parameter is an optional query parameter that specifies the
   * maximum number of records to return in the response. If not provided, a default value of 10 is
   * used.
   * @param {string} [recordId] - The `recordId` parameter is an optional string parameter that
   * represents the ID of a specific record. If provided, the function will only return records that
   * match the specified `recordId`.
   * @returns a Promise that resolves to an array of StateTracking objects.
   */
  async findAllRecords(
    @param.path.string('recordType') recordType: string,
    @param.query.number('skip') skip?: number,
    @param.query.number('limit') limit?: number,
    @param.query.string('recordId') recordId?: string,
  ): Promise<StateTracking[]> {
    return this.stateTrackingService.findAllRecords(
      recordType,
      skip ?? 0,
      limit ?? 10,
      recordId,
    );
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.DeleteIngestionMappings]})
  @get('/state-tracking/count/{recordType}', {
    responses: {
      '200': {
        description: 'Count StateTracking by recordType',
        content: {
          'application/json': {
            schema: {type: 'object', properties: {count: {type: 'number'}}},
          },
        },
      },
    },
  })

  /**
   * The countRecords function returns the count of records based on the record type and optional
   * record ID.
   * @param {string} recordType - A string parameter that represents the type of record. It is required
   * and must be provided as a path parameter in the URL.
   * @param {string} [recordId] - The `recordId` parameter is an optional query parameter of type
   * string. It is used to specify the ID of a specific record.
   * @returns a Promise that resolves to an object with a property "count" of type number.
   */
  async countRecords(
    @param.path.string('recordType') recordType: string,
    @param.query.string('recordId') recordId?: string,
  ): Promise<{count: number}> {
    return this.stateTrackingService.countRecords(recordType, recordId);
  }
}
