import {CustomFilter} from '../models';

export function checkActedOn(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
): boolean {
  const {actedOn, actedOnList} = filterUsed;
  const customActedOnList = customFilter.actedOnList;
  // Check if both actedOn and actedOnList are null or if customFilter's actedOnList is null
  // Check if filterUsed.actedOn is defined and included in customFilter.actedOnList
  // Check if both actedOnLists have common elements
  if (
    (actedOn == null && actedOnList == null) ||
    customActedOnList == null ||
    (actedOn && customActedOnList.includes(actedOn)) ||
    (actedOnList && haveCommonElements(customActedOnList, actedOnList))
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
  const actionGroupList = filterUsed.actionGroupList;
  const customActionGroupList = customFilter.actionGroupList;
  if (
    customActionGroupList == null ||
    actionGroupList == null ||
    haveCommonElements(actionGroupList, customActionGroupList)
  ) {
    return true;
  }
  return false;
}

export function checkEntityId(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
): boolean {
  if (
    customFilter.entityId == null ||
    filterUsed.entityId == null ||
    filterUsed.entityId === customFilter.entityId
  ) {
    return true;
  }
  return false;
}

export function checkDates(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
) {
  const {fromDate: usedFromDate, toDate: usedToDate} = filterUsed.date!;
  const {fromDate: customFromDate, toDate: customToDate} = customFilter.date!;
  if (
    customFilter.date == null ||
    filterUsed.date == null ||
    (usedFromDate <= customToDate && usedToDate >= customFromDate)
  ) {
    return true;
  }
  return false;
}

export function haveCommonElements(arr1: string[], arr2: string[]): boolean {
  return arr1.some(item => arr2.includes(item));
}
