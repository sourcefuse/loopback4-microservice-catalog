import {BindingScope, inject, injectable} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import {UserIdentity} from '../enums';
import {AuthServiceBindings} from '../keys';
import {ActiveUsersFilter} from '../models';
import {UserRepository, UserTenantRepository} from '../repositories';
import {ActorId} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class ActiveUserFilterBuilderService {
  constructor(
    @inject(AuthServiceBindings.ActorIdKey, {optional: true})
    private readonly actorKey: ActorId,
    @repository(UserRepository)
    public userRepo: UserRepository,
    @repository(UserTenantRepository)
    public userTenantRepo: UserTenantRepository,
  ) {}

  async buildActiveUsersFilter(filter: ActiveUsersFilter): Promise<AnyObject> {
    let actorIds: string[] = [];
    // sonarignore:start
    if (filter.userIdentity === UserIdentity.ACTOR_ID) {
      actorIds = filter.userIdentifier;
    } else {
      // check if actor is userTenantId
      if (this.actorKey === 'id') {
        const users = await this.userRepo.findAll({
          where: {username: {inq: filter.userIdentifier}},
        });
        const userIds = users.map(u => u.id ?? '0');
        if (userIds.length <= 0) {
          return {};
        }
        const userTenants = await this.userTenantRepo.findAll({
          where: {
            userId: {inq: userIds},
          },
        });
        actorIds = userTenants.map(ut => ut.id ?? '0');

        // else actor is userId
      } else {
        // get list of user Id based on username
        const users = await this.userRepo.findAll({
          where: {username: {inq: filter.userIdentifier}},
        });
        actorIds = users.map(u => u.id ?? '0');
      }
    }
    // sonarignore:end
    //include userIds
    if (filter.inclusion) {
      return {actor: {inq: actorIds}};
      //exclude userIds
    } else {
      return {actor: {nin: actorIds}};
    }
  }
}
