// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import {HasManyRepositoryFactory, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {DEFAULT_RECENTS, Errors} from '../const';
import {SearchServiceBindings} from '../keys';
import {SearchQuery} from '../models';
import {RecentSearchRepository} from '../repositories';
import {SearchServiceConfig} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class RecentSearchHelperService {
  public readonly params: HasManyRepositoryFactory<
    SearchQuery,
    typeof SearchQuery.prototype.id
  >;

  constructor(
    @repository(RecentSearchRepository)
    public recentSearchRepository: RecentSearchRepository,
    @inject(SearchServiceBindings.Config)
    private readonly config: SearchServiceConfig,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {}

  async create(query: SearchQuery, user?: IAuthUserWithPermissions) {
    if (!user) {
      throw new HttpErrors.BadRequest(Errors.USER_MISSING);
    }

    let saved = await this.recentSearchRepository.findOne({
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
      saved = await this.recentSearchRepository.create({
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
