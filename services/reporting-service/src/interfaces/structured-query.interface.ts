// The WhereCondition type defines a single condition with a field, operator, and value.
type Operator = 'LIKE' | 'NOT LIKE' | '=' | '<>' | '<' | '>' | '<=' | '>=';
export type WhereCondition = {
  field: string;
  operator: Operator;
  value: string | number;
};

// The WhereClause type allows for both 'and'/'or' groupings and single field conditions.
export type WhereClause = {
  and?: (WhereCondition | WhereClause)[];
  or?: (WhereCondition | WhereClause)[];
  [field: string]:
    | WhereCondition
    | (WhereCondition | WhereClause)[]
    | undefined;
};

// The StructuredQueryInterface includes all parts of an SQL SELECT statement.
export interface StructuredQueryInterface {
  select: {
    fields: (string | {field: string; alias: string})[];
    functions?: {
      functionType: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX';
      field: string;
      alias?: string;
    }[];
    distinct?: boolean;
  };
  from: {
    dataSources: string[];
    joins?: {
      type: string;
      dataSource: string;
      on: string;
    }[];
  };
  where?: WhereClause;
  orderBy?: {
    field: string;
    order: 'asc' | 'desc';
  }[];
  limit?: number;
  offset?: number;
}
