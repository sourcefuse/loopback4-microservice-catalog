import {CustomFilter} from '../models';

export function checkActedOn(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
): boolean | undefined {
  const {actedOn, actedOnList} = filterUsed;
  const customActedOnList = customFilter.actedOnList;
  const actedOnInCustomList = actedOn && customActedOnList?.includes(actedOn);
  // Check if both actedOn and actedOnList are null or if customFilter's actedOnList is null
  // Check if filterUsed.actedOn is defined and included in customFilter.actedOnList
  // Check if both actedOnLists have common elements
  return (
    (actedOn == null && actedOnList == null) ||
    customActedOnList == null ||
    actedOnInCustomList ||
    (actedOnList && haveCommonElements(customActedOnList, actedOnList))
  );
}

export function checkActionGroup(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
): boolean {
  const actionGroupList = filterUsed.actionGroupList;
  const customActionGroupList = customFilter.actionGroupList;
  return (
    customActionGroupList == null ||
    actionGroupList == null ||
    haveCommonElements(actionGroupList, customActionGroupList)
  );
}

export function checkEntityId(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
): boolean {
  return (
    customFilter.entityId == null ||
    filterUsed.entityId == null ||
    filterUsed.entityId === customFilter.entityId
  );
}

export function checkDates(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
) {
  // sonarignore:start
  const {fromDate: usedFromDate, toDate: usedToDate} = filterUsed.date!;
  const {fromDate: customFromDate, toDate: customToDate} = customFilter.date!;
  // sonarignore:end

  return (
    customFilter.date == null ||
    filterUsed.date == null ||
    (usedFromDate <= customToDate && usedToDate >= customFromDate)
  );
}

export function haveCommonElements(arr1: string[], arr2: string[]): boolean {
  return arr1.some(item => arr2.includes(item));
}
