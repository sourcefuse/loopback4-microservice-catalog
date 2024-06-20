import {CustomFilter} from '../models';

export function checkActedOn(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
): boolean {
  // Check if both actedOn and actedOnList are null or if customFilter's actedOnList is null
  if (
    (filterUsed.actedOn == null && filterUsed.actedOnList == null) ||
    customFilter.actedOnList == null
  ) {
    return true;
  }
  // Check if filterUsed.actedOn is defined and included in customFilter.actedOnList
  if (
    filterUsed.actedOn &&
    customFilter.actedOnList.includes(filterUsed.actedOn)
  ) {
    return true;
  }
  // Check if both actedOnLists have common elements
  if (
    filterUsed.actedOnList &&
    haveCommonElements(customFilter.actedOnList, filterUsed.actedOnList)
  ) {
    return true;
  }
  // If none of the above conditions are met, return false
  return false;
}

export function checkActionGroup(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
): boolean {
  if (
    customFilter.actionGroupList == null ||
    filterUsed.actionGroupList == null
  ) {
    return true;
  }
  if (
    haveCommonElements(filterUsed.actionGroupList, customFilter.actionGroupList)
  ) {
    return true;
  }
  return false;
}

export function checkEntityId(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
): boolean {
  if (customFilter.entityId == null || filterUsed.entityId == null) {
    return true;
  }
  if (filterUsed.entityId === customFilter.entityId) {
    return true;
  }
  return false;
}

export function checkDates(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
) {
  if (customFilter.date == null || filterUsed.date == null) {
    return true;
  }
  if (
    filterUsed.date.fromDate <= customFilter.date.toDate &&
    filterUsed.date.toDate >= customFilter.date.fromDate
  ) {
    return true;
  }
  return false;
}

export function haveCommonElements(arr1: string[], arr2: string[]): boolean {
  return arr1.some(item => arr2.includes(item));
}
