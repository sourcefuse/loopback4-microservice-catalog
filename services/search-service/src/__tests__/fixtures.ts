// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  AnyObject,
  Entity,
  model,
  Model,
  property,
  ShortHandEqualType,
} from '@loopback/repository';
import {ModelProperties} from '..';
import {SearchQueryBuilder} from '../classes';
import {ColumnMap} from '../types';

const testQueryStmt = (columns: string, name: string, where: string) =>
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

@model({
  name: 'TestSearchedCustom',
})
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

@model({
  name: 'TestSearchedCustom',
})
export class TestSearchedCustomWithIdentifier extends Entity {
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
  _placeholderIndex = 1;
  search(
    modelCtor: typeof Model,
    columns: (keyof TestSearchModel)[] | ColumnMap<TestSearchModel>,
  ) {
    const modelName = modelCtor.modelName;
    let columnList;
    let baseWhere;
    if (Array.isArray(columns)) {
      columnList = columns.join(', ');
      baseWhere = columns.map(c => `${c} = $1`).join(', ');
    } else {
      columnList = (Object.keys(columns) as ModelProperties<TestSearchModel>[])
        .map(k => `${columns[k]} as ${k}`)
        .join(', ');
      baseWhere = Object.keys(columns)
        .map(c => `${c} = $1`)
        .join(', ');
    }

    const where = this.whereBuild(modelCtor, this.query.where?.[modelName]);
    const whereClause = [baseWhere];
    if (where.sql) {
      whereClause.push(where.sql);
    }

    this.baseQueryList.push({
      sql: testQueryStmt(
        columnList,
        modelCtor.modelName,
        whereClause.join(' AND '),
      ),
      params: where.params,
    });
  }

  paramString(index: number) {
    return `$${index}`;
  }

  paramsBuild(param: string): AnyObject | Array<AnyObject | string> {
    const params = this.baseQueryList.reduce(
      (t: ShortHandEqualType[], v) => [...t, ...v.params],
      [],
    );
    return [param, ...params];
  }
}
