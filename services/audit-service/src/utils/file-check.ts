import {CustomFilter} from '../models';

export function checkActedOn(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
): boolean | undefined {
  let {actedOn, actedOnList} = filterUsed;
  const customActedOnList = customFilter.actedOnList;
  actedOnList = actedOnList ?? [];
  // Check if both actedOn and actedOnList are null or if customFilter's actedOnList is null
  // Check if filterUsed.actedOn is defined and included in customFilter.actedOnList
  // Check if both actedOnLists have common elements
  if (!!actedOn) {
    actedOnList = [...new Set([...actedOnList, actedOn])];
  }

  return (
    (actedOn == null && actedOnList == null) ||
    customActedOnList == null ||
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
    !customActionGroupList ||
    !actionGroupList ||
    haveCommonElements(actionGroupList, customActionGroupList)
  );
}

export function checkEntityId(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
): boolean {
  return (
    !customFilter.entityId ||
    !filterUsed.entityId ||
    filterUsed.entityId === customFilter.entityId
  );
}

export function checkDates(
  filterUsed: CustomFilter,
  customFilter: CustomFilter,
) {
  return (
    !customFilter.date ||
    !filterUsed.date ||
    (customFilter.date.toDate >= filterUsed.date.fromDate &&
      customFilter.date.fromDate <= filterUsed.date.toDate)
  );
}

export function haveCommonElements(arr1: string[], arr2: string[]): boolean {
  return arr1.some(item => arr2.includes(item));
}
