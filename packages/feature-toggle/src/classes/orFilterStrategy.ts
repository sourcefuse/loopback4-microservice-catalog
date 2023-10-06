// OrFilterStrategy.ts

import {FilterStrategy} from '../types';

export class OrFilterStrategy implements FilterStrategy {
  /**
   * The function applies a filter to an array of strings and returns a new array containing only the
   * elements that match the filter values.
   * @param {string[]} data - An array of strings representing the data that needs to be filtered.
   * @param {string[]} filterValues - An array of strings representing the values to filter the data
   * array with.
   * @returns an array of strings.
   */
  applyFilter(data: string[], filterValues: string[]): string[] {
    return data.every(item => filterValues.includes(item))
      ? data.filter(item => filterValues.includes(item))
      : [];
  }
}
