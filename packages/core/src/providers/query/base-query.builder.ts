import {Entity, Filter, RelationMetadata} from '@loopback/repository';
import {WhereBuilderFunction, BuilderConfig} from './types';
import {ModelConstructor} from '../../types';
import {Errors} from './errors';
import {AnyObject} from 'loopback-datasource-juggler';
import {HttpErrors} from '@loopback/rest';
import {FromClause} from '.';

export abstract class QueryBuilder<T extends Entity> {
  constructor(
    private model: ModelConstructor<T>,
    private whereBuilder: WhereBuilderFunction,
    private config: BuilderConfig,
  ) {}

  public select<T extends Entity>(
    model: ModelConstructor<T>,
    filter: Filter<T>,
    prevOn?: string,
  ) {
    const baseModelName = this.getModelName(model);
    const baseModelSchema = this.getSchema(model);
    const fields = this.getModelFields(model, filter);
    const selectors = this.getSelector(model, fields);
    const from: FromClause[] = [
      {
        sql: `${baseModelSchema}.${baseModelName} as ${baseModelName}`,
        type: 'table',
      },
    ];
    const where = this.whereBuilder(baseModelName, model, filter.where);
    const params = where.params;
    const {inclusionMap, inclusionList} = this.includeToMapAndList(filter);
    const idColumn = this.findIdColumn(this.model);
    const parentOn = `${baseModelName}.${idColumn}`;
    const whereClause =
      where.sql || prevOn
        ? `where ${[where.sql, prevOn].filter(q => q).join(' AND ')}`
        : ``;
    const fromClauseBuilder = (clauses: FromClause[]) => {
      return clauses
        .map(clause => {
          if (clause.type === 'join') {
            return `(${clause.sql}) as ${clause.prefix} ON true`;
          } else {
            return clause.sql;
          }
        })
        .join(' LEFT JOIN LATERAL ');
    };
    let groupClause = '';
    if (inclusionList.length > 0) {
      groupClause = `group by ${parentOn}`;
    }
    for (let inclusion of inclusionList) {
      const {relationModel, metadata} = this.getRelatedModel(model, inclusion);
      const inclusionScope = inclusionMap[inclusion];
      const fields = this.getModelFields(relationModel, inclusionScope);
      const childModelName = this.getModelName(relationModel);
      const childModelSchema = this.getSchema(relationModel);
      const selector = `${this.joinAggregator(
        relationModel,
        this.getSelector(relationModel, fields),
      )} as ${inclusion}`;
      const foreignKey = this.getForeignKey(relationModel, metadata);
      const onClause = `${parentOn} = ${childModelName}.${foreignKey}`;
      selectors.push(selector);
      const childSelect = this.select(
        relationModel,
        inclusionScope ?? {},
        onClause,
      );
      from.push({
        type: 'join',
        sql: childSelect.sql,
        prefix: childModelName,
      });
      params.push(...childSelect.params);
    }

    const selectClause = `SELECT ${selectors.join(', ')}`;
    const fromClause = `from ${fromClauseBuilder(from)}`;
    const limitClause = this.limitBuilder(model, filter);
    const offsetClause = this.offsetBuilder(model, filter);
    const orderClause = this.orderBuilder(model, filter);
    return {
      sql: [
        selectClause,
        fromClause,
        whereClause,
        groupClause,
        orderClause,
        limitClause,
        offsetClause,
      ]
        .filter(r => r)
        .join(' '),
      params,
    };
  }

  joinAggregator<T extends Entity>(
    entity: ModelConstructor<T>,
    selectors: string[],
  ) {
    const prefix = this.getModelName(entity);
    return `COALESCE(jsonb_agg(${prefix}) FILTER (WHERE ${prefix} IS NOT NULL), '[]')`;
  }

  getForeignKey<T extends Entity>(
    model: ModelConstructor<T>,
    relation: RelationMetadata,
  ) {
    let on;
    const defaultId = `${relation.source.name.toLowerCase()}Id`;
    switch (relation?.type) {
      case 'hasMany':
        on = (relation as AnyObject).keyTo ?? defaultId;
        break;
      case 'belongsTo':
        on = (relation as AnyObject).keyTo ?? defaultId;
        break;
      default:
        throw new HttpErrors.BadRequest(
          `${Errors.UNSUPPORTED_RELATION_TYPE}:${relation.type}`,
        );
    }
    return this.getColumnTableName(model, on);
  }
  getModelFields<T extends Entity>(
    entity: ModelConstructor<T>,
    filter?: Filter<T>,
  ) {
    const fields = Object.keys(entity.definition.properties);
    if (filter?.fields) {
      if (Array.isArray(filter.fields)) {
        const valid = filter.fields.filter(field => fields.includes(field));
        const invalid = filter.fields.filter(field => !fields.includes(field));
        if (invalid.length === 0) {
          return valid;
        } else {
          throw new HttpErrors.BadRequest(
            `${Errors.INVALID_PROPERTY}:${invalid.join(', ')}`,
          );
        }
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

  limitBuilder<T extends Entity>(
    entity: ModelConstructor<T>,
    filter: Filter<T>,
  ) {
    if (filter.limit) {
      return `LIMIT ${filter.limit}`;
    } else {
      return ``;
    }
  }

  offsetBuilder<T extends Entity>(
    entity: ModelConstructor<T>,
    filter: Filter<T>,
  ) {
    if (filter.offset) {
      return `OFFSET ${filter.offset}`;
    } else {
      return ``;
    }
  }

  orderBuilder<T extends Entity>(
    entity: ModelConstructor<T>,
    filter: Filter<T>,
  ) {
    const fields = this.getModelFields(entity, filter);
    const selectors = this.getSelector(entity, fields);
    const possibleFields = [...fields, ...selectors];
    if (filter.order) {
      const orderPairs = filter.order
        .map(order => {
          const [column, sortOrder] = order.split(' ');
          if (
            !possibleFields.includes(column) ||
            !(sortOrder === 'DESC' || sortOrder === 'ASC')
          ) {
            throw new HttpErrors.BadRequest(Errors.INVALID_ORDER);
          }
          return `${column} ${sortOrder}`;
        })
        .join(', ');
      return `ORDER BY ${orderPairs}`;
    } else {
      return ``;
    }
  }

  getSelector<T extends Entity>(model: ModelConstructor<T>, fields: string[]) {
    const prefix = this.getModelName(model);
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

  findIdColumn(entity: ModelConstructor<T>) {
    const props = Object.entries(entity.definition.properties);
    const idTuple = props.find(
      propertyTuple => (propertyTuple[1] as AnyObject).id,
    );
    if (idTuple) {
      return idTuple[0] as keyof ModelConstructor<T>;
    } else {
      throw new Error(Errors.NO_ID_PROPERTY);
    }
  }

  getColumnTableName<T extends Entity>(
    entity: ModelConstructor<T>,
    key: keyof ModelConstructor<T>,
  ) {
    if (entity.definition.properties[key]?.name || key) {
      return entity.definition.properties[key]?.name || key;
    } else {
      throw new Error(`${Errors.INVALID_PROPERTY}:${key}`);
    }
  }

  getModelName<S extends Entity>(entity: ModelConstructor<S>) {
    return entity.modelName;
  }

  getSchema<S extends Entity>(entity: ModelConstructor<S>) {
    return this.config.schema ?? 'public';
  }

  getRelatedModel<R extends Entity, S extends Entity>(
    entity: ModelConstructor<R>,
    key: string,
  ) {
    const relations = entity.definition.relations;
    if (relations[key]) {
      return {
        relationModel: relations[
          key
        ].target() as unknown as ModelConstructor<S>,
        metadata: relations[key],
      };
    } else {
      throw new Error(`${Errors.INVALID_RELATION}:${key}`);
    }
  }

  includeToMapAndList<T extends Entity>(filter: Filter<T>) {
    const filterMap: {[key: string]: Filter<Entity> | undefined} = {};
    const relations =
      filter.include?.map(includer => {
        if (typeof includer === 'string') {
          return includer;
        } else {
          filterMap[includer.relation] = includer.scope as Filter<Entity>;
          return includer.relation;
        }
      }) ?? [];
    return {
      inclusionMap: filterMap,
      inclusionList: relations,
    };
  }
}
