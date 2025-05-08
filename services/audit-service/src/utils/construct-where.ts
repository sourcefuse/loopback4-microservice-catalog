import {Where} from '@loopback/repository';
import {CustomFilter} from '../models';

/**
 * The function constructs a "where" object based on various conditions provided in the custom filter.
 * @param {CustomFilter} customFilter - The `constructWhere` function takes in a `customFilter` object
 * as a parameter. This object likely contains various filter criteria that are used to construct a
 * `Where` object with specific conditions for querying data.
 * @returns The function `constructWhere` is returning an object of type `Where` which contains an
 * array of conditions based on the custom filter provided. The conditions include date condition,
 * deleted condition, entity ID condition, acted on condition, and action group condition.
 */
export async function constructWhere(customFilter: CustomFilter) {
  const where: Where = {and: []};

  const dateCondition = getDateCondition(customFilter);
  if (dateCondition) where.and.push(dateCondition);

  const deletedCondition = getDeletedCondition(customFilter);
  if (deletedCondition) where.and.push(deletedCondition);

  const entityCondition = getEntityIdCondition(customFilter);
  if (entityCondition) where.and.push(entityCondition);

  const actedOnCondition = getActedOnCondition(customFilter);
  if (actedOnCondition) where.and.push(actedOnCondition);

  const actionGroupCondition = getActionGroupCondition(customFilter);
  if (actionGroupCondition) where.and.push(actionGroupCondition);

  return where;
}

/**
 * The function `_getDateCondition` returns a date condition object based on the provided custom
 * filter's date range.
 * @param {CustomFilter} customFilter - CustomFilter {
 * @returns An object with the property "actedAt" containing an array with two Date objects
 * representing the fromDate and toDate values from the customFilter object.
 */
function getDateCondition(customFilter: CustomFilter) {
  if (customFilter.date?.fromDate && customFilter.date.toDate) {
    return {
      actedAt: {
        between: [
          new Date(customFilter.date.fromDate),
          new Date(customFilter.date.toDate),
        ],
      },
    };
  }
  return null;
}

/**
 * The function `_getDeletedCondition` generates a filter condition based on the `deleted` property of
 * a custom filter object.
 * @param {CustomFilter} customFilter - CustomFilter is an object that may contain a property called
 * 'deleted'. If 'deleted' is undefined, the function returns null. If 'deleted' is a truthy value, the
 * function returns a condition that checks for the presence of a specific value in the 'deleted'
 * property. If 'deleted
 * @returns The function `_getDeletedCondition` returns a condition object based on the
 * `customFilter.deleted` value. If `customFilter.deleted` is `undefined`, it returns `null`. If
 * `customFilter.deleted` is `true`, it returns an object with an `or` condition array. If
 * `customFilter.deleted` is `false`, it returns an object with a single condition.
 */
function getDeletedCondition(customFilter: CustomFilter) {
  if (customFilter.deleted === undefined) return null;

  if (customFilter.deleted) {
    return {
      or: [
        {after: null},
        {
          after: {
            regexp: `"{0,1}deleted"{0,1}\\s*:\\s*${customFilter.deleted}`,
          },
        },
      ],
    };
  } else {
    return {
      after: {
        regexp: `"{0,1}deleted"{0,1}\\s*:\\s*${customFilter.deleted}`,
      },
    };
  }
}

/**
 * The function _getEntityIdCondition returns an object with the entityId property set to
 * customFilter.entityId if it exists, otherwise it returns null.
 * @param {CustomFilter} customFilter - CustomFilter object that may contain an entityId property.
 * @returns an object with the key "entityId" set to the value of customFilter.entityId if
 * customFilter.entityId is truthy. Otherwise, it returns null.
 */
function getEntityIdCondition(customFilter: CustomFilter) {
  return customFilter.entityId ? {entityId: customFilter.entityId} : null;
}

/**
 * The function `_getActedOnCondition` returns a filter object based on the `actedOn` or `actedOnList`
 * properties of a `CustomFilter` object.
 * @param {CustomFilter} customFilter - CustomFilter object that contains information about actedOn and
 * actedOnList properties.
 * @returns an object with a property "actedOn" containing a condition object with an "inq" key set to
 * an array. The array is determined based on the presence of either "customFilter.actedOn" or
 * "customFilter.actedOnList" in the input "customFilter". If either of these properties exists, the
 * array will be populated accordingly. If neither property exists, the
 */
function getActedOnCondition(customFilter: CustomFilter) {
  if (customFilter.actedOn ?? customFilter.actedOnList) {
    const array = customFilter.actedOn
      ? [customFilter.actedOn]
      : customFilter.actedOnList;
    return {
      actedOn: {inq: array},
    };
  }
  return null;
}

/**
 * The function _getActionGroupCondition returns a condition object based on the actionGroupList
 * provided in the customFilter parameter.
 * @param {CustomFilter} customFilter - A custom filter object that contains a list of action groups.
 * @returns an object with the property "actionGroup" set to an object with the property "inq" set to
 * the value of "customFilter.actionGroupList" if "customFilter.actionGroupList" is truthy. Otherwise,
 * it returns null.
 */
function getActionGroupCondition(customFilter: CustomFilter) {
  return customFilter.actionGroupList
    ? {actionGroup: {inq: customFilter.actionGroupList}}
    : null;
}
