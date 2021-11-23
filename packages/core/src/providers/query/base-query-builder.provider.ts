import {Entity, Filter} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {FilterWithJoin, RelationMap, RelationType} from '../../mixins/types';
import {QueryList, WhereBuilderFunction} from './types';
import {Errors} from './errors';
import {ModelConstructor} from '../../types';
import {RelationsMap} from '../types';

export abstract class QueryBuilder<
  P extends Entity,
  S extends RelationMap,
  R extends S[keyof S],
> {
  private model: ModelConstructor<P>;
  private namespace: string;
  private whereBuilder: WhereBuilderFunction;
  private relations: RelationsMap;
  private idType?: string;
  constructor(
    model: ModelConstructor<P>,
    relations: RelationsMap,
    whereBuilder: WhereBuilderFunction,
    namespace?: string,
    idType?: string,
  ) {
    this.model = model;
    this.relations = relations;
    this.whereBuilder = whereBuilder;
    this.idType = idType;
    if (namespace) {
      this.namespace = namespace;
    }
  }

  build(filter: FilterWithJoin<P, S, R>) {
    const stmts = new QueryList();
    const selectors = [];
    const relations = Object.values(filter.join) as Array<RelationType<R>>;
    const baseClause = this.buildRelationQuery(
      'base',
      this.model,
      this.filterFromFilterWithJoin(filter),
      'id' as keyof P,
    );
    const baseOn = this._getModelIdField(this.model);
    selectors.push(baseClause.selector.join(', '));
    for (const relation of relations) {
      const prefix = this._getModelName(relation.model);
      let on;
      const relationConfig = (Object.entries(this.relations).find(
        r => r[1].target().modelName === relation.model.modelName,
      ) ?? [])[1];
      const defaultId = `${this.model.modelName.toLowerCase()}Id`;
      if (relationConfig) {
        switch (relationConfig?.type) {
          case 'hasMany':
            on = relationConfig.keyTo ?? defaultId;
            break;
          case 'belongsTo':
            on = relationConfig.keyTo ?? defaultId;
            break;
          default:
            throw new HttpErrors.BadRequest(
              `${Errors.UNSUPPORTED_RELATION_TYPE}:${relationConfig.type}`,
            );
        }
      } else {
        throw new HttpErrors.BadRequest(
          `${Errors.INVALID_RELATION}:${relation.model.modelName}`,
        );
      }
      const clauses = this.buildRelationQuery(
        prefix,
        relation.model,
        relation.filter,
        on,
      );

      const ON = [`base.${baseOn} = ${prefix}.${clauses.on}`, clauses.where.sql]
        .filter(v => v)
        .join(' AND ');
      selectors.push(
        `${this.selectorToAggregator(clauses.selector)} as ${prefix}`,
      );
      stmts.add({
        sql: `${this.namespace}.${clauses.from} as ${prefix} ON ${ON}`,
        params: clauses.where.params,
      });
    }
    const final = stmts.merge(' INNER JOIN ');
    return {
      sql: `SELECT ${selectors.join(', ')} FROM ${this.namespace}.${
        baseClause.from
      } as base INNER JOIN ${final.sql} group by base.${baseOn}`,
      params: final.params,
    };
  }

  selectorToAggregator(selectors: string[]) {
    return `json_agg(json_build_object(${selectors
      .map(s => {
        const [field, as] = s.split(' as ');
        return `'${as}', ${field}`;
      })
      .join(', ')}))`;
  }

  buildRelationQuery<T extends Entity>(
    prefix: string,
    model: ModelConstructor<T>,
    filter?: Filter<T>,
    onClause?: keyof T,
  ) {
    const fields = this._getModelFields(model, filter);
    const selector = this.getSelector(prefix, model, fields);
    const from = this._getModelName(model);
    const where = this.where(prefix, model, filter);
    let on: string | undefined;
    if (onClause) on = this._getFieldName(model, onClause);
    return {
      selector,
      from,
      where,
      on,
    };
  }

  getSelector<T extends Entity>(
    prefix: string,
    model: ModelConstructor<T>,
    fields: string[],
  ) {
    const properties = model.definition.properties;
    return fields.map(field => {
      const property = properties[field];
      if (!property) {
        throw new HttpErrors.BadRequest(`${Errors.INVALID_PROPERTY}:${field}`);
      }
      if (!property.name || property.name === field) {
        return `${prefix}.${field} as ${field}`;
      } else {
        return `${prefix}.${property.name} as ${field}`;
      }
    });
  }

  where<T extends Entity>(
    prefix: string,
    model: ModelConstructor<T>,
    filter?: Filter<T>,
  ) {
    return this.whereBuilder(prefix, model, filter?.where, this.idType);
  }

  order<T extends Entity>(
    prefix: string,
    model: ModelConstructor<T>,
    filter: Filter<T>,
  ) {
    if (filter.order) {
      return filter.order
        .map(order => {
          const [column, orderType] = order.split(' ') as [
            keyof T,
            'ASC' | 'DESC',
          ];
          if (column) {
            const columnName = this._getFieldName(model, column);
            if (orderType === 'ASC' || orderType === 'DESC') {
              return `${prefix}.${columnName} ${orderType}`;
            } else {
              throw new HttpErrors.BadRequest(Errors.INVALID_ORDER);
            }
          } else {
            throw new HttpErrors.BadRequest(Errors.INVALID_ORDER);
          }
        })
        .join(', ');
    }
  }

  private _getModelName<T extends Entity>(model: ModelConstructor<T>) {
    return model.modelName;
  }

  private _getFieldName<T extends Entity>(
    model: ModelConstructor<T>,
    name: keyof T,
  ) {
    const property = model.definition.properties[name as string];
    if (!property) {
      throw new HttpErrors.BadRequest(Errors.INVALID_PROPERTY);
    } else {
      return property.name ?? name;
    }
  }

  private _getModelFields<T extends Entity>(
    model: ModelConstructor<T>,
    filter?: Filter<T>,
  ) {
    const fields = Object.keys(model.definition.properties);
    if (filter?.fields) {
      if (Array.isArray(filter.fields)) {
        return filter.fields.filter(field => fields.includes(field));
      } else {
        const filterFields = Object.entries(filter.fields);
        return filterFields
          .filter(field => field[1] && fields.includes(field[0]))
          .map(field => field[0]);
      }
    } else {
      return fields;
    }
  }

  private _getModelIdField<T extends Entity>(model: ModelConstructor<T>) {
    const properties = model.definition.properties;
    const fields = Object.keys(properties);
    for (const field of fields) {
      if (properties[field].id) {
        return properties[field].name ?? field;
      }
    }
  }

  private filterFromFilterWithJoin<T extends Entity>(
    filter: FilterWithJoin<T, S, R>,
  ): Filter<T> {
    return {
      where: filter.where,
      order: filter.order,
      limit: filter.limit,
      skip: filter.skip,
      offset: filter.offset,
      fields: filter.fields,
    };
  }

  private capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
