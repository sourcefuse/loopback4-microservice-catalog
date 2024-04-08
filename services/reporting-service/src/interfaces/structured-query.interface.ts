export type Operator =
  | 'LIKE'
  | 'NOT LIKE'
  | '<>'
  | '<'
  | '>'
  | '<='
  | '>='
  | '='
  | 'IN'
  | 'NOT IN'
  | 'EXISTS'
  | 'IS'
  | 'IS NOT';
export type OrderDirection = 'ASC' | 'DESC';
export type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';

// Simplified FieldExpression for easier usage
export type FieldExpression =
  | string
  | AliasExpression
  | FunctionExpression
  | SubQueryWithAlias;

export interface AliasExpression {
  field: FieldExpression;
  alias: string;
}

export interface FunctionExpression {
  function: string; // example 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX'
  args: FieldExpression[];
  alias?: string;
}

// DataSource can be a simple string, a table with an alias, or a subquery with an alias
export type DataSource = string | DataSourceWithAlias | SubQueryWithAlias;

export interface DataSourceWithAlias {
  source: string;
  alias: string;
}

export interface SubQueryWithAlias {
  query: StructuredQueryInterface;
  alias?: string;
}

export interface WhereCondition {
  field: FieldExpression;
  operator: Operator;
  // sonarignore:start
  value:
    | string
    | number
    | boolean
    | string[]
    | number[]
    | null
    | FieldExpression
    | SubQueryWithAlias;
  // sonarignore:end
  valueType?: 'literal' | 'column';
}

export interface SelectClause {
  fields?: FieldExpression[];
  distinct?: boolean;
  functions?: FunctionExpression[];
}

export interface JoinClause {
  type: JoinType;
  source: DataSource;
  on: WhereCondition | WhereCondition[];
}

export type WhereClause = {
  and?: (WhereCondition | WhereClause)[];
  or?: (WhereCondition | WhereClause)[];
};

export interface StructuredQueryInterface {
  select: SelectClause;
  from: DataSource;
  join?: JoinClause[];
  where?: WhereClause;
  orderBy?: {field: FieldExpression; order: OrderDirection}[];
  groupBy?: FieldExpression[];
  having?: WhereClause;
  limit?: number;
  offset?: number;
}
