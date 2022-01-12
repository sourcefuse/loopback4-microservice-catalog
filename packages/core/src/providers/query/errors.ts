export enum Errors {
  INVALID_PROPERTY = 'Invalid Property',
  INVALID_ORDER = 'Invalid Order',
  UNKNOWN_PROPERTY = 'Invalid Property',
  INVALID_WHERE_OPERATOR = 'Invalid Where Property',
  EXACTLY_TWO_VALUES_FOR_BETWEEN = 'Exactly two values allowed for between operator',
  UNSUPPORTED_CONNECTOR = 'Unsupported Connector',
  UNEXPECTED = 'Unexpected Error',
  UNSUPPORTED_RELATION_TYPE = 'Relation type not supported',
  INVALID_RELATION = 'Invalid Relation',
  MUST_PROVIDE_JOIN = 'Must provide atleast a join filter to use this method',
  NO_ID_PROPERTY = 'No ID property in the model',
}
