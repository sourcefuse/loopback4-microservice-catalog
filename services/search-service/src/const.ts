// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export const DEFAULT_COLUMNS = ['name', 'data'];
export const DEFAULT_RECENTS = 5;
export const TWO = 2;
export const THREE = 3;

export enum Errors {
  QUERY_MISSING = 'Missing query',
  NO_MODELS = 'No Models configured for SearchComponent',
  OFFSET_WITH_TYPE = 'Offset is not allowed with limitByType option',
  OFFSET_WITHOUT_LIMIT = 'Offset is not allowed without limit',
  TYPE_WITHOUT_LIMIT = 'limitByType is not allowed without limit',
  INVALID_ORDER = 'Invalid order format',
  UNSUPPORTED_CONNECTOR = 'Unsupported Connector',
  MISSING_MATCH = 'Missing match parameter',
  ATLEAST_ONE_CONFIG = 'Must provide atleast one search configuration',
  NO_COLUMNS_TO_MATCH = 'No columns to match',
  USER_MISSING = 'User Missing while saving recent search',
  AUTHENTICATION_SETUP = 'Must provide authentication and authorization config for controller when using default sequence',
  FAILED = 'Unknown Failure',
  NO_RECENT = 'No recent searches by this user',
  DB_ERROR = 'Error while fetching data from database',
  UNKNOWN_PROPERTY = 'Unknown Property',
  INVALID_WHERE_OPERATOR = 'Invalid Where Operator',
  EXACTLY_TWO_VALUES_FOR_BETWEEN = 'between operator expects exactly two values',
}

export enum CONNECTORS {
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
}
