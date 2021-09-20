import {Entity, property, model} from '@loopback/repository';
import {SearchQueryBuilder} from '../classes';
import {ColumnMap} from '../types';

const TestQueryStmt = (columns: string, name: string, where: string) =>
  `SELECT ${columns} from ${name} where ${where}`;

@model({})
export class TestSearchModel extends Entity {
  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'string',
  })
  name: string;
}

@model({})
export class TestSearched extends Entity {
  @property({
    type: 'string',
  })
  description: string;
  @property({
    type: 'string',
  })
  name: string;
}

@model({})
export class TestSearchedCustom extends Entity {
  @property({
    type: 'string',
  })
  about: string;

  @property({
    type: 'string',
  })
  identifier: string;
}

export class TestQueryBuilder extends SearchQueryBuilder<TestSearchModel> {
  unionString = ' UNION ALL ';
  search(
    modelName: string,
    columns: (keyof TestSearchModel)[] | ColumnMap<TestSearchModel>,
  ) {
    let columnList;
    let where;
    if (Array.isArray(columns)) {
      columnList = columns.join(', ');
      where = columns.map(c => `${c} = $1`).join(', ');
    } else {
      columnList = (Object.keys(columns) as (keyof TestSearchModel)[])
        .map(k => `${columns[k]} as ${k}`)
        .join(', ');
      where = Object.keys(columns)
        .map(c => `${c} = $1`)
        .join(', ');
    }
    this.baseQueryList.push(TestQueryStmt(columnList, modelName, where));
  }
}
