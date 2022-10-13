// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Getter, inject} from '@loopback/core';
import {
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SearchServiceConfig} from '..';
import {DEFAULT_RECENTS, Errors} from '../const';
import {SearchServiceBindings} from '../keys';
import {RecentSearch, SearchQuery} from '../models';
import {SearchQueryRepository} from './search-query.repository';

export class RecentSearchRepository extends DefaultUserModifyCrudRepository<
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
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(RecentSearch, dataSource, getCurrentUser);
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
        fields: {
          where: false,
        },
      });

      const recentCount =
        this.config.controller?.recentCount ?? DEFAULT_RECENTS;

      //to delete from recent search if already present
      const prevMatched = prev
        .filter(
          item =>
            item.match.toLocaleLowerCase() === query.match.toLocaleLowerCase(),
        )
        .map(item => item.id);
      await this.params(saved.id).delete({
        id: {
          inq: prevMatched,
        },
      });

      if (prev.length >= recentCount) {
        const latestOnes = prev.slice(0, recentCount).map(item => item.id);
        await this.params(saved.id).delete({
          id: {
            nin: latestOnes,
          },
        });
      }
    } else {
      saved = await super.create({
        userId: user.userTenantId,
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
