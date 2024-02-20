import {BindingScope, injectable} from '@loopback/core';
import {Count, repository} from '@loopback/repository';
import {IngestionMapping} from '../models/ingestion-mapping.model';
import {IngestionMappingsRepository} from '../repositories/ingestion-mappings.repository';
@injectable({scope: BindingScope.TRANSIENT})
export class IngestionMappingsService {
  constructor(
    @repository(IngestionMappingsRepository)
    private readonly ingestionMappingsRepository: IngestionMappingsRepository,
  ) {}
  /**
   * The function `deleteByName` deletes a record from the `ingestionMappingsRepository` based on the
   * provided `dataSourceName`.
   * @param {string} dataSourceName - The parameter `dataSourceName` is a string that represents the
   * name of the data source to be deleted.
   * @returns either void or a Promise that resolves to void.
   */
  deleteByName(dataSourceName: string): void | PromiseLike<void> {
    return this.ingestionMappingsRepository.deleteById(dataSourceName);
  }
  /**
   * The function "getByName" retrieves ingestion mappings by their data source name.
   * @param {string} dataSourceName - A string representing the name of the data source.
   * @returns either an IngestionMappings object or a Promise that resolves to an IngestionMappings
   * object.
   */
  getByName(
    dataSourceName: string,
  ): IngestionMapping | Promise<IngestionMapping> {
    return this.ingestionMappingsRepository.findById(dataSourceName);
  }
  /**
   * The function `getAll` returns a promise that resolves to an array of `IngestionMappings` objects.
   * @returns The getAll() function is returning a Promise that resolves to an array of
   * IngestionMappings objects.
   */
  getAll(): Promise<IngestionMapping[]> {
    return this.ingestionMappingsRepository.find();
  }
  /**
   * The function updates an ingestion mapping object in a data source repository.
   * @param {string} dataSourceName - A string representing the name of the data source.
   * @param {IngestionMapping} IngestionMapObj - The IngestionMapObj parameter is an object that
   * contains the ingestion mappings for a data source. It is used to update the ingestion mappings
   * in the repository.
   * @returns a Promise that resolves to void.
   */
  update(
    dataSourceName: string,
    ingestionMapObj: IngestionMapping,
  ): Promise<void> {
    return this.ingestionMappingsRepository.updateById(
      dataSourceName,
      ingestionMapObj,
    );
  }
  /**
   * The function creates an ingestion mapping object and returns it or a promise of it.
   * @param {IngestionMapping} IngestionMapObj - An object that contains the mappings for ingestion.
   * It could include properties such as source fields and their corresponding destination fields,
   * data transformations, and any other relevant information for the ingestion process.
   * @returns either an IngestionMappings object or a Promise that resolves to an IngestionMappings
   * object.
   */
  create(
    ingestionMapObj: IngestionMapping,
  ): IngestionMapping | Promise<IngestionMapping> {
    return this.ingestionMappingsRepository.create(ingestionMapObj);
  }
  /**
   * The `getCount` function returns a promise that resolves to the count of ingestion mappings.
   * @returns The `getCount()` function is returning a Promise that resolves to a `Count` object.
   */
  getCount(): Promise<Count> {
    return this.ingestionMappingsRepository.count();
  }
}
