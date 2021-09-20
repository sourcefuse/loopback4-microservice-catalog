export const DEFAULT_COLUMNS = ['name', 'data'];

export enum Errors {
  NO_MODELS = 'No Models configured for SearchComponent',
  OFFSET_WITH_TYPE = 'Offset is not allowed with limitByType option',
  OFFSET_WITHOUT_LIMIT = 'Offset is not allowed without limit',
  TYPE_WITHOUT_LIMIT = 'limitWithoutType is not allowed without limit',
  INVALID_ORDER = 'Invalid order format',
  UNSUPPORTED_CONNECTOR = 'Unsupported Connector',
  MISSING_MATCH = 'Missing match parameter',
  ATLEAST_ONE_CONFIG = 'Must provide atleast one search configuration',
}

export enum CONNECTORS {
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
}
