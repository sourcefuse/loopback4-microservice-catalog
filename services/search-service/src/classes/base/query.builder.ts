import {AnyObject, DataObject} from '@loopback/repository';
import {HttpErrors, Model} from '@loopback/rest';
import {SearchQuery, SearchResult} from '../../models';
import {ColumnMap, isSearchableModel, SearchableModel} from '../../types';
import {Errors} from '../../const';

export abstract class SearchQueryBuilder<T extends Model> {
  protected baseQueryList: string[];
  protected limitQuery: string;
  protected orderQuery: string;
  protected query: DataObject<SearchQuery>;
  protected schema?: string;
  constructor(query: DataObject<SearchQuery>, schema?: string) {
    this.query = query;
    this.schema = schema;
  }
  abstract search(model: string, columns: Array<keyof T> | ColumnMap<T>): void;

  abstract unionString: string;

  limit() {
    if (this.query.limit) {
      if (this.query.limitByType) {
        if (this.query.offset) {
          throw new HttpErrors.BadRequest(Errors.OFFSET_WITH_TYPE);
        }
        this.baseQueryList = this.baseQueryList.map(
          q => `${q} LIMIT ${this.query.limit}`,
        );
      } else {
        this.limitQuery = `LIMIT ${this.query.limit} OFFSET ${
          this.query.offset ?? 0
        }`;
      }
    } else {
      if (this.query.limitByType) {
        throw new HttpErrors.BadRequest(Errors.TYPE_WITHOUT_LIMIT);
      }
      if (this.query.offset) {
        throw new HttpErrors.BadRequest(Errors.OFFSET_WITHOUT_LIMIT);
      }
    }
  }

  order(columns: Array<keyof T>) {
    let orderQuery: string;
    if (this.query.order) {
      const [column, sortOrder] = this.query.order.split(' ') as [
        keyof T,
        'ASC' | 'DESC',
      ];
      if (
        !columns.includes(column) ||
        !(sortOrder === 'DESC' || sortOrder === 'ASC')
      ) {
        throw new HttpErrors.BadRequest(Errors.INVALID_ORDER);
      }
      orderQuery = `ORDER BY ${column} ${sortOrder}`;
    } else {
      orderQuery = 'ORDER BY rank DESC';
    }
    if (this.query.limitByType) {
      this.baseQueryList = this.baseQueryList.map(q => `${q} ${orderQuery}`);
    }
    this.orderQuery = orderQuery;
  }

  build(models: (SearchableModel<T> | typeof Model)[], type?: typeof Model) {
    if (!this.query.match) {
      throw new HttpErrors.BadRequest(Errors.MISSING_MATCH);
    }
    return [this.queryBuild(models, type), this.paramsBuild(this.query.match)];
  }

  paramsBuild(param: string): AnyObject | Array<AnyObject | string> {
    return [param];
  }

  queryBuild(
    models: (SearchableModel<T> | typeof Model)[],
    type?: typeof Model,
  ) {
    this.baseQueryList = [];
    this.limitQuery = '';
    this.orderQuery = '';
    if (!type) {
      type = SearchResult;
    }
    const defaultColumns = Object.keys(
      type.definition.properties,
    ) as (keyof T)[];
    models.forEach(model => {
      if (isSearchableModel(model)) {
        this.search(model.model.name, model.columns);
      } else {
        this.search(model.name, defaultColumns);
      }
    });
    this.order(defaultColumns);
    this.limit();
    const mainQuery = this.baseQueryList
      .map(query => `(${query})`)
      .join(this.unionString);
    return [mainQuery, this.orderQuery, this.limitQuery]
      .filter(q => q?.length > 0)
      .join(' ');
  }
}
