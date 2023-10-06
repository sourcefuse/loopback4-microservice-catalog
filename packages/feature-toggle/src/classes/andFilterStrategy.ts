import {FilterStrategy} from '../types';

export class AndFilterStrategy implements FilterStrategy {
  /**
   * The function applies a filter to an array of strings and returns a new array containing only the
   * strings that include all the filter values.
   * @param {string[]} data - An array of strings that represents the data to be filtered. Each string
   * in the array is an item that will be checked against the filter values.
   * @param {string[]} filterValues - An array of strings representing the values to filter the data
   * by.
   * @returns an array of strings that pass the filter.
   */
  applyFilter(data: string[], filterValues: string[]): string[] {
    return data.filter(item =>
      filterValues.some(filter => item.includes(filter)),
    );
  }
}
