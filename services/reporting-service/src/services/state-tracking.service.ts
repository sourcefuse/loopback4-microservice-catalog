import {BindingScope, injectable} from '@loopback/core';
import {FilterBuilder, WhereBuilder} from '@loopback/filter';
import {Where, repository} from '@loopback/repository';
import {StateTracking} from '../models';
import {StateTrackingRepository} from '../repositories/state-tracking.repository';
@injectable({scope: BindingScope.TRANSIENT})
export class StateTrackingService {
  constructor(
    @repository(StateTrackingRepository)
    private readonly stateTrackingRepo: StateTrackingRepository,
  ) {}

  /**
   * The function `findLatestRecord` retrieves the latest record of a given type and optional ID from a
   * repository.
   * @param {string} recordType - The `recordType` parameter is a string that represents the type of
   * record you want to find the latest entry for. It is used to filter the records based on their
   * type.
   * @param {string} [recordId] - The `recordId` parameter is an optional string that represents the ID
   * of a specific record. If provided, the function will filter the records based on this ID. If not
   * provided, the function will return the latest record of the specified `recordType` without any
   * filtering based on the ID.
   * @returns The function `findLatestRecord` returns a Promise that resolves to either the latest
   * record of type `StateTracking` that matches the given `recordType` and `recordId`, or `null` if no
   * matching record is found.
   */
  async findLatestRecord(
    recordType: string,
    recordId?: string,
  ): Promise<StateTracking | null> {
    let whereCondition: Where<StateTracking> = {recordType: recordType};

    if (recordId) {
      // Constructing the 'and' condition properly
      whereCondition = {
        and: [{recordType: recordType}, {recordId: recordId}],
      };
    }

    const filter = {
      where: whereCondition,
      order: ['timestamp DESC'],
      limit: 1,
    };

    const [latestRecord] = await this.stateTrackingRepo.find(filter);
    return latestRecord ?? null;
  }

  /**
   * The `findAllRecords` function retrieves a list of state tracking records based on the specified
   * record type, skip and limit parameters, and an optional record ID.
   * @param {string} recordType - The `recordType` parameter is a string that specifies the type of
   * records you want to retrieve. It is used to filter the records based on their type.
   * @param {number} [skip=0] - The `skip` parameter is used to specify the number of records to skip
   * before returning the results. It is optional and has a default value of 0, meaning it will start
   * returning records from the beginning.
   * @param {number} [limit=10] - The `limit` parameter specifies the maximum number of records to
   * retrieve from the database. By default, it is set to 10 if no value is provided.
   * @param {string} [recordId] - The `recordId` parameter is an optional string that represents the
   * unique identifier of a specific record. If provided, the function will only return records that
   * have a matching `recordId` value. If not provided, all records of the specified `recordType` will
   * be returned.
   * @returns a Promise that resolves to an array of StateTracking objects.
   */
  async findAllRecords(
    recordType: string,
    skip = 0,
    limit = 10,
    recordId?: string,
  ): Promise<StateTracking[]> {
    const whereBuilder = new WhereBuilder<StateTracking>().eq(
      'recordType',
      recordType,
    );
    if (recordId) {
      whereBuilder.and({recordId: recordId});
    }
    const filter = new FilterBuilder<StateTracking>()
      .where(whereBuilder.build())
      .skip(skip)
      .limit(limit)
      .build();
    return this.stateTrackingRepo.find(filter);
  }

  /**
   * The function counts the number of records of a given type, optionally filtered by a specific
   * record ID.
   * @param {string} recordType - The `recordType` parameter is a string that represents the type of
   * records you want to count. It is used to filter the records based on their type.
   * @param {string} [recordId] - The `recordId` parameter is an optional string that represents the ID
   * of a specific record. If provided, the function will only count the records that have a matching
   * `recordId`. If not provided, the function will count all records of the specified `recordType`.
   * @returns an object with a single property "count", which represents the number of records that
   * match the specified criteria.
   */
  async countRecords(
    recordType: string,
    recordId?: string,
  ): Promise<{count: number}> {
    let whereCondition: Where<StateTracking> = {recordType: recordType};

    if (recordId) {
      whereCondition = {
        and: [{recordType: recordType}, {recordId: recordId}],
      };
    }

    const count = await this.stateTrackingRepo.count(whereCondition);
    return {count: count.count};
  }
}
