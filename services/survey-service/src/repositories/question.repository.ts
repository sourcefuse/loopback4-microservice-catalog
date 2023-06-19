import {MysqlDataSource} from '../datasources';
import {
  Question,
  QuestionRelations,
  Batch,
  QuestionCategory,
  QuestionDomain,
  QuestionVendorGroup,
  Options,
  Category,
  VendorGroup,
  Domain,
  User,
  QuestionResponse,
  SurveyResponseDetail,
  Survey,
} from '../models';
import {getLimitOffset} from '../utils';
import {AuditLogRepository} from './audit-log.repository';
import {BatchRepository} from './batch.repository';
import {CategoryRepository} from './category.repository';
import {DomainRepository} from './domain.repository';
import {OptionsRepository} from './options.repository';
import {QuestionCategoryRepository} from './question-category.repository';
import {QuestionDomainRepository} from './question-domain.repository';
import {QuestionVendorGroupRepository} from './question-vendor-group.repository';
import {SurveyResponseDetailRepository} from './survey-response-detail.repository';
import {SurveyRepository} from './survey.repository';
import {UserRepository} from './user.repository';
import {VendorGroupRepository} from './vendor-group.repository';
import {ActionGroup, AuditActionKey, QueryBindings} from '@local/rakuten-core';
import {WhereBuilderFunction} from '@local/rakuten-core/dist/types';
import {inject, Getter} from '@loopback/core';
import {
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
  Filter,
  Inclusion,
  AnyObject,
  HasManyThroughRepositoryFactory,
  HasOneRepositoryFactory,
  Where,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Action, AuditLog, IAuditMixinOptions} from '@sourceloop/audit-log';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
  ILogger,
  LOGGER,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';

const auditOpts: IAuditMixinOptions = {
  actionKey: AuditActionKey.Question,
  actionGroup: ActionGroup.Question,
};
interface LooseObject {
  [key: string]: {displayName: string};
}

export class QuestionRepository extends DefaultUserModifyCrudRepository<
  Question,
  typeof Question.prototype.id,
  QuestionRelations
> {
  public readonly batch: BelongsToAccessor<Batch, typeof Question.prototype.id>;

  public readonly rootQuestion: BelongsToAccessor<
    Question,
    typeof Question.prototype.id
  >;

  public readonly parentQuestion: BelongsToAccessor<
    Question,
    typeof Question.prototype.id
  >;

  public readonly questionCategories: HasManyRepositoryFactory<
    QuestionCategory,
    typeof Question.prototype.id
  >;

  public readonly questionDomains: HasManyRepositoryFactory<
    QuestionDomain,
    typeof Question.prototype.id
  >;

  public readonly questionVendorGroups: HasManyRepositoryFactory<
    QuestionVendorGroup,
    typeof Question.prototype.id
  >;

  public readonly options: HasManyRepositoryFactory<
    Options,
    typeof Question.prototype.id
  >;

  public readonly followUpQuestions: HasManyRepositoryFactory<
    Question,
    typeof Question.prototype.id
  >;

  public readonly categories: HasManyThroughRepositoryFactory<
    Category,
    typeof Category.prototype.id,
    QuestionCategory,
    typeof Question.prototype.id
  >;

  public readonly vendorGroups: HasManyThroughRepositoryFactory<
    VendorGroup,
    typeof VendorGroup.prototype.id,
    QuestionVendorGroup,
    typeof Question.prototype.id
  >;

  public readonly domains: HasManyThroughRepositoryFactory<
    Domain,
    typeof Domain.prototype.id,
    QuestionDomain,
    typeof Question.prototype.id
  >;

  public readonly createdByUser: HasOneRepositoryFactory<
    User,
    typeof Question.prototype.createdBy
  >;
  public readonly modifiedByUser: HasOneRepositoryFactory<
    User,
    typeof Question.prototype.modifiedBy
  >;

  public readonly surveyResponseDetail: HasOneRepositoryFactory<
    SurveyResponseDetail,
    typeof Question.prototype.id
  >;

  public readonly survey: BelongsToAccessor<
    Survey,
    typeof Question.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('BatchRepository')
    protected batchRepositoryGetter: Getter<BatchRepository>,
    @repository.getter('QuestionCategoryRepository')
    protected questionCategoryRepositoryGetter: Getter<QuestionCategoryRepository>,
    @repository.getter('QuestionDomainRepository')
    protected questionDomainRepositoryGetter: Getter<QuestionDomainRepository>,
    @repository.getter('QuestionVendorGroupRepository')
    protected questionVendorGroupRepositoryGetter: Getter<QuestionVendorGroupRepository>,
    @repository.getter('OptionsRepository')
    protected optionsRepositoryGetter: Getter<OptionsRepository>,
    @repository.getter('AuditLogRepository')
    public getAuditLogRepository: Getter<AuditLogRepository>,
    @repository.getter('UserRepository')
    getUserRepository: Getter<UserRepository>,
    @inject(QueryBindings.QUERY_WHERE_BUILDER_PROVIDER)
    private whereBuilder: WhereBuilderFunction,
    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
    @repository.getter('VendorGroupRepository')
    protected vendorGroupRepositoryGetter: Getter<VendorGroupRepository>,
    @repository.getter('DomainRepository')
    protected domainRepositoryGetter: Getter<DomainRepository>,
    @repository.getter('SurveyResponseDetailRepository')
    protected surveyResponseDetailRepositoryGetter: Getter<SurveyResponseDetailRepository>,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @repository.getter('SurveyRepository')
    protected surveyRepositoryGetter: Getter<SurveyRepository>,
  ) {
    super(Question, dataSource, getCurrentUser);

    this.survey = this.createBelongsToAccessorFor(
      'survey',
      surveyRepositoryGetter,
    );
    this.registerInclusionResolver('survey', this.survey.inclusionResolver);

    this.surveyResponseDetail = this.createHasOneRepositoryFactoryFor(
      'surveyResponseDetail',
      surveyResponseDetailRepositoryGetter,
    );
    this.registerInclusionResolver(
      'surveyResponseDetail',
      this.surveyResponseDetail.inclusionResolver,
    );
    this.domains = this.createHasManyThroughRepositoryFactoryFor(
      'domains',
      domainRepositoryGetter,
      questionDomainRepositoryGetter,
    );
    this.registerInclusionResolver('domains', this.domains.inclusionResolver);
    this.vendorGroups = this.createHasManyThroughRepositoryFactoryFor(
      'vendorGroups',
      vendorGroupRepositoryGetter,
      questionVendorGroupRepositoryGetter,
    );
    this.registerInclusionResolver(
      'vendorGroups',
      this.vendorGroups.inclusionResolver,
    );
    this.categories = this.createHasManyThroughRepositoryFactoryFor(
      'categories',
      categoryRepositoryGetter,
      questionCategoryRepositoryGetter,
    );
    this.registerInclusionResolver(
      'categories',
      this.categories.inclusionResolver,
    );
    this.followUpQuestions = this.createHasManyRepositoryFactoryFor(
      'followUpQuestions',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'followUpQuestions',
      this.followUpQuestions.inclusionResolver,
    );
    this.options = this.createHasManyRepositoryFactoryFor(
      'options',
      optionsRepositoryGetter,
    );
    this.registerInclusionResolver('options', this.options.inclusionResolver);
    this.questionVendorGroups = this.createHasManyRepositoryFactoryFor(
      'questionVendorGroups',
      questionVendorGroupRepositoryGetter,
    );
    this.registerInclusionResolver(
      'questionVendorGroups',
      this.questionVendorGroups.inclusionResolver,
    );
    this.questionDomains = this.createHasManyRepositoryFactoryFor(
      'questionDomains',
      questionDomainRepositoryGetter,
    );
    this.registerInclusionResolver(
      'questionDomains',
      this.questionDomains.inclusionResolver,
    );
    this.questionCategories = this.createHasManyRepositoryFactoryFor(
      'questionCategories',
      questionCategoryRepositoryGetter,
    );
    this.registerInclusionResolver(
      'questionCategories',
      this.questionCategories.inclusionResolver,
    );
    this.parentQuestion = this.createBelongsToAccessorFor(
      'parentQuestion',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'parentQuestion',
      this.parentQuestion.inclusionResolver,
    );
    this.rootQuestion = this.createBelongsToAccessorFor(
      'rootQuestion',
      Getter.fromValue(this),
    );
    this.registerInclusionResolver(
      'rootQuestion',
      this.rootQuestion.inclusionResolver,
    );
    this.batch = this.createBelongsToAccessorFor(
      'batch',
      batchRepositoryGetter,
    );
    this.registerInclusionResolver('batch', this.batch.inclusionResolver);

    this.createdByUser = this.createHasOneRepositoryFactoryFor(
      'createdByUser',
      getUserRepository,
    );
    this.registerInclusionResolver(
      'createdByUser',
      this.createdByUser.inclusionResolver,
    );

    this.modifiedByUser = this.createHasOneRepositoryFactoryFor(
      'modifiedByUser',
      getUserRepository,
    );
    this.registerInclusionResolver(
      'modifiedByUser',
      this.modifiedByUser.inclusionResolver,
    );
  }

  joins: string[] = [];
  extraWhere = `AND question.parent_question_id IS NULL AND question.status NOT IN('Predefined', 'Added to survey')`;

  relationNameWithKey: {
    [type: string]: {
      relation: string;
      key: string;
    };
  } = {
    categoryId: {
      relation: 'question_category',
      key: 'category_id',
    },
    domainId: {
      relation: 'question_domain',
      key: 'domain_id',
    },
    vendorGroupId: {
      relation: 'question_vendor_group',
      key: 'vendor_group_id',
    },
  };

  async findQuestion(filter?: Filter<Question>) {
    const {questionFilter, removedValues} = this._excludeRelationalFields(
      ['categoryId', 'domainId', 'vendorGroupId'],
      filter,
    );

    let where = this._generateWhere(questionFilter);

    where = this._appendRemovedFilter(removedValues, where);

    const {limit, offset} = getLimitOffset(filter?.limit, filter?.skip);

    const order = filter?.order
      ? ` ORDER BY ${this._getOrderBy(filter.order)}`
      : '';

    const fields = this._getFields();
    const select = `SELECT question.id,${fields}`;

    this.joins.push(
      'LEFT JOIN users ON user_tenant_id=question.created_by',
      'LEFT JOIN users mbu ON mbu.user_tenant_id=question.modified_by',
      'LEFT JOIN batch ON batch.id=question.batch_id',
    );

    const relationFields = [
      'any_value(users.full_name) as createdByName',
      'any_value(mbu.full_name) as modifiedByName',
      'any_value(batch.name) as batchName',
    ];

    const qry =
      ` ${select}${relationFields} FROM question  ${this.joins.join(
        ' ',
      )} WHERE ${where?.sql} ${this.extraWhere} GROUP BY question.id` +
      order +
      limit +
      offset;

    const questions = (await this.execute(
      qry,
      where?.params,
    )) as (QuestionResponse & {id: string})[];

    if (questions?.length) {
      let questionIdString = '';
      questions.forEach(question => {
        questionIdString = questionIdString
          ? `${questionIdString},'${question.id}'`
          : `'${question.id}'`;
      });
      const categoriesPromise = this.getRelationData(
        questionIdString,
        'question_category',
        'categories',
        'name',
        'category_id',
        'id',
      );

      const domainsPromise = this.getRelationData(
        questionIdString,
        'question_domain',
        'domains',
        'name',
        'domain_id',
        'id',
      );

      const vendorGroupsPromise = this.getRelationData(
        questionIdString,
        'question_vendor_group',
        'vendor_groups',
        'name',
        'vendor_group_id',
        'id',
      );

      const [categories, domains, vendorGroups] = await Promise.all([
        categoriesPromise,
        domainsPromise,
        vendorGroupsPromise,
      ]);
      return questions?.map(
        question =>
          new QuestionResponse({
            ...question,
            category: categories[question.id],
            domain: domains[question.id],
            vendorGroup: vendorGroups[question.id],
          }),
      );
    }
    return questions;
  }

  async getRelationData(
    questionIdString: string,
    fromRelation: string,
    toRelation: string,
    fieldKey: string,
    fromKey: string,
    toKey: string,
  ) {
    let qry = `SELECT ${toRelation}.${fieldKey}, ${fromRelation}.question_id FROM ${fromRelation} LEFT JOIN ${toRelation} on ${toRelation}.${toKey} = ${fromRelation}.${fromKey} AND ${toRelation}.deleted=0 WHERE ${fromRelation}.question_id IN (${questionIdString}) AND ${fromRelation}.deleted=0`;
    const relationData = (await this.execute(qry)) as AnyObject[];

    const questionRelationMap: {[key: string]: string[]} = {};
    //Create Map where key is question_id
    relationData?.forEach(data => {
      if (!questionRelationMap[data.question_id]) {
        questionRelationMap[data.question_id] = [];
      }
      questionRelationMap[data.question_id].push(data[fieldKey]);
    });
    return questionRelationMap;
  }

  async findCount(filter?: Filter<Question>) {
    const {questionFilter, removedValues} = this._excludeRelationalFields(
      ['categoryId', 'domainId', 'vendorGroupId'],
      filter,
    );

    let where = this._generateWhere(questionFilter ?? filter);

    where = this._appendRemovedFilter(removedValues, where);

    const select = `SELECT  question.id,count(question.id) as count`;

    const qry = ` ${select} FROM question  ${this.joins.join(' ')} WHERE ${
      where?.sql
    } ${this.extraWhere} GROUP BY question.id`;

    return this.execute(qry, where?.params);
  }

  private _appendRemovedFilter(
    removedValues: AnyObject[],
    where?: {
      sql: string;
      params: AnyObject[];
    },
  ) {
    if (removedValues.length && where) {
      removedValues.forEach(val => {
        if (val.value.inq.length) {
          //convert inq element to string and push in where params
          where.params.push(...val.value.inq.map(String));

          // create ?,?,? for sql params
          const queryStr = Array(val.value.inq.length).fill('?').join(',');

          const {relation, key} = this.relationNameWithKey[val.key];
          this.joins.push(
            `LEFT JOIN ${relation} ON ${relation}.question_id = question.id  AND ${relation}.deleted=0`,
          );
          where.sql = `${where?.sql} and ${relation}.${key} IN (${queryStr})`;
        }
      });
    }
    return where;
  }

  private _excludeRelationalFields(
    exclude: string[],
    questionFilter?: Filter<Question>,
  ) {
    const removedValues = [];

    const whereFields = (questionFilter?.where as AnyObject).and as AnyObject[];
    const excludedWhereFields: AnyObject[] = [];
    if (whereFields) {
      for (const whereEntry of whereFields) {
        const key = Object.keys(whereEntry)[0];
        if (exclude.includes(key)) {
          removedValues.push({key, value: whereEntry[key]});
        } else {
          excludedWhereFields.push(whereEntry);
        }
      }
      (questionFilter?.where as AnyObject).and = excludedWhereFields;
    }

    return {questionFilter, removedValues};
  }

  private _generateWhere(filter?: Filter<Question>) {
    let where;
    let relationWhere: AnyObject[] = [];

    let excludeWhere: string[] = [];
    if (filter?.include?.length) {
      const ans = this._parseRelationWhere(filter, filter.where);
      relationWhere = ans.relationWhere;
      excludeWhere = ans.excludeInParentWhere;
    }

    if (filter?.where) {
      filter.where = this.exculdeWhere(filter.where, excludeWhere);
      where = this.whereBuilder(Question, filter.where);
    }
    if (relationWhere.length) {
      for (const rw of relationWhere) {
        if (!where) {
          where = {params: [], sql: ''};
        }
        where = {
          sql: where?.sql + ' AND ' + rw.sql,
          params: [...where.params, ...rw.params],
        };
      }
    }
    return where;
  }

  exculdeWhere(where: Where<Question>, excludeWhere: string[]) {
    let whereStr = JSON.stringify(where);

    excludeWhere.forEach(e => {
      const str = `${JSON.stringify({[e]: true})},`;
      whereStr = whereStr.replace(str, '');
    });
    return JSON.parse(whereStr) as Where<Question>;
  }
  private _parseRelationWhere(
    filter: Filter<Question>,
    parentWhere?: AnyObject,
  ) {
    const excludeInParentWhere: string[] = [];
    const relationWhere = [];
    const relations = Question.definition.relations;
    for (const include of filter.include as Inclusion[]) {
      if (include?.scope?.where) {
        if (!relations[include.relation]) {
          throw new HttpErrors.UnprocessableEntity(
            `Invalid inclusion filter ${include.relation}`,
          );
        }
        const model = relations[include.relation].target();
        relationWhere.push(this.whereBuilder(model, include?.scope?.where));
      }
    }
    return {relationWhere, excludeInParentWhere};
  }

  private _getFields(): string {
    const modelProerties = Question.definition.properties;

    let qry = '';

    const allFields: LooseObject = {};
    for (const key in modelProerties) {
      const name = modelProerties[key].name ?? key;
      allFields[name] = {displayName: key};
    }
    const keys = Object.keys(allFields);

    keys.forEach((field, index) => {
      qry += `question.${field} as ${allFields[field].displayName}${
        index !== keys.length ? ',' : ''
      }`;
    });

    return qry;
  }

  private _getOrderBy(order: string[] | string): string {
    if (!order?.length) {
      return '';
    }
    const orderArray = typeof order === 'string' ? [order] : order;

    const modelProperties = QuestionResponse.definition.properties;
    const questionModelProperties = Question.definition.properties;

    let qry = '';
    orderArray.forEach((item: string, index: number) => {
      const orderBy = item.split(' ');

      if (!modelProperties[orderBy[0]]) {
        throw new HttpErrors.UnprocessableEntity(
          `Invalid order field ${orderBy[0]}`,
        );
      }
      const isNewProperty = questionModelProperties[orderBy[0]];
      const field = modelProperties[orderBy[0]].name ?? orderBy[0];
      const table = isNewProperty ? 'question.' : '';
      qry += `${table}${field} ${orderBy[1]}${
        index !== orderArray.length - 1 ? ',' : ''
      }`;
    });

    return qry;
  }

  async addLog(
    entityId: string,
    after: AnyObject,
    before: AnyObject,
    action: Action | undefined,
    actionKey: string,
    tenantId: string,
    actedOn?: string,
  ) {
    const user = await this.getCurrentUser();
    const auditRepo = await this.getAuditLogRepository();
    const audit = new AuditLog({
      actedAt: new Date(),
      actor: (user?.id as any)?.toString() ?? '0', //NOSONAR
      action: action,
      after: after,
      before: before,
      actionKey: actionKey,
      entityId: entityId,
      tenantId: tenantId,
      actedOn: actedOn ?? this.entityClass.modelName,
    });
    auditRepo.create(audit).catch(err => {
      this.logger.error(
        `Audit failed for data => ${JSON.stringify(audit.toJSON())}`,
      );
    });
  }
}
