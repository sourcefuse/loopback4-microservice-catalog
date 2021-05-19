import {Getter, inject, Provider} from '@loopback/core';
import {AnyObject, repository} from '@loopback/repository';
import * as casbin from 'casbin';
import {
  AuthorizationBindings,
  AuthorizationMetadata,
  CasbinConfig,
  CasbinEnforcerConfigGetterFn,
  IAuthUserWithPermissions,
  ResourcePermissionObject,
} from 'loopback4-authorization';

import {UserLevelResourceRepository} from '../repositories';

export class CasbinEnforcerConfigProvider
  implements Provider<CasbinEnforcerConfigGetterFn>
{
  constructor(
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getCasbinMetadata: Getter<AuthorizationMetadata>,
    @repository(UserLevelResourceRepository)
    public userResourcesRepository: UserLevelResourceRepository,
  ) {}

  value(): CasbinEnforcerConfigGetterFn {
    return (
      authUser: IAuthUserWithPermissions,
      resource: string,
      isCasbinPolicy = false,
    ) => this.action(authUser, resource, isCasbinPolicy);
  }

  async action(
    authUser: IAuthUserWithPermissions,
    resourceValue: string,
    isCasbinPolicy = false,
  ): Promise<CasbinConfig> {
    const resourceIds = resourceValue.split(',');
    const {permissions}: AuthorizationMetadata = await this.getCasbinMetadata(); // decorator permissions

    const userPermissions = permissions.filter(permission =>
      authUser.permissions.includes(permission),
    );
    let resourcesAllowed: ResourcePermissionObject[] = [];

    const userResources = await this._getUserResources(authUser); //permissions with the resource value
    resourcesAllowed = userPermissions.map(permission => {
      return {permission: permission, resource: '*'};
    });

    for (const resourceId of resourceIds) {
      userResources?.forEach(userResource => {
        const [permission, resource] = userResource.split('/');
        resourcesAllowed.push({
          permission,
          resource: resourceId === '*' ? '*' : resource,
        });
      });
    }

    //sub=userId, obj:permission, action= * || resourceValue
    const modelText = `
    [request_definition]
    r = sub, obj, act

    [policy_definition]
    p = sub, obj, act

    [policy_effect]
    e = some(where (p.eft == allow))

    [matchers]
    m = r.sub == p.sub && r.obj == p.obj && (r.act == p.act || p.act=='*')
    `;

    const model = casbin.newModelFromString(modelText);

    return {
      model,
      allowedRes: resourcesAllowed,
    };
  }

  private async _getUserResources(authUser: IAuthUserWithPermissions) {
    const userResources = await this.userResourcesRepository.find({
      where: {
        userTenantId: (authUser as AnyObject).userTenantId,
      },
      fields: {
        resourceName: true,
        resourceValue: true,
        allowed: true,
      },
    });
    return userResources.map(
      userResource =>
        `${userResource.resourceName}/${userResource.resourceValue}`,
    );
  }
}
