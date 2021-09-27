import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SearchServiceConfig} from '..';
import {DEFAULT_RECENTS, Errors} from '../const';
import {SearchServiceBindings} from '../keys';
import {RecentSearch, SearchQuery} from '../models';
import {SearchQueryRepository} from './search-query.repository';

export class RecentSearchRepository extends DefaultCrudRepository<
  RecentSearch,
  typeof RecentSearch.prototype.id
> {
  public readonly params: HasManyRepositoryFactory<
    SearchQuery,
    typeof SearchQuery.prototype.id
  >;

  constructor(
    @inject(`datasources.${SearchServiceBindings.DATASOURCE_NAME}`)
    dataSource: juggler.DataSource,
    @repository.getter('SearchQueryRepository')
    queryRepositoryGetter: Getter<SearchQueryRepository>,
    @inject(SearchServiceBindings.Config)
    private readonly config: SearchServiceConfig,
  ) {
    super(RecentSearch, dataSource);
    this.params = this.createHasManyRepositoryFactoryFor(
      'params',
      queryRepositoryGetter,
    );
    this.registerInclusionResolver('params', this.params.inclusionResolver);
  }

  async create(query: SearchQuery, user?: IAuthUserWithPermissions) {
    if (!user) {
      throw new HttpErrors.BadRequest(Errors.USER_MISSING);
    }

    let saved = await super.findOne({
      where: {
        userId: user.userTenantId,
      },
    });

    if (saved?.id) {
      const prev = await this.params(saved.id).find({
        order: ['created_on DESC'],
      });

      const recentCount =
        this.config.controller?.recentCount ?? DEFAULT_RECENTS;

      if (prev.length >= recentCount) {
        await this.params(saved.id).delete({
          id: prev[recentCount - 1].id,
        });
      }
    } else {
      saved = await super.create({
        userId: user.id,
      });
    }

    if (saved?.id) {
      await this.params(saved.id).create({
        ...query,
        recentSearchId: saved.id,
      });
    } else {
      throw new HttpErrors.InternalServerError(Errors.FAILED);
    }

    return saved;
  }
}
