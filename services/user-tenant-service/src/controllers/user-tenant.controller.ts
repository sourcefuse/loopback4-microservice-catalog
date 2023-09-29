import {
    Filter,
    repository,
  } from '@loopback/repository';
  import {
    get,
    getModelSchemaRef,
    HttpErrors,
    param,
  } from '@loopback/rest';
  import {
    UserTenant,
    Tenant,
  } from '../models';
  import {TenantRepository, UserTenantRepository} from '../repositories';
  import { IAuthUserWithPermissions, OPERATION_SECURITY_SPEC } from '@sourceloop/core';
  import { authenticate, AuthenticationBindings, STRATEGY } from 'loopback4-authentication';
  import { authorize, AuthorizeErrorKeys } from 'loopback4-authorization';
  import { PermissionKey, STATUS_CODE } from '../enums';
  import { inject } from '@loopback/core';

  const baseUrl='/user/{id}/tenants';
  
  export class UserTenantController {
    constructor(
      @repository(UserTenantRepository) protected userTenantRepository: UserTenantRepository,
      @repository(TenantRepository) protected tenantRepository: TenantRepository,
      @inject(AuthenticationBindings.CURRENT_USER)
      private readonly currentUser: IAuthUserWithPermissions,
    ) { }
  
  
    @authenticate(STRATEGY.BEARER, {
      passReqToCallback: true,
    })
    @authorize({
      permissions: [
        PermissionKey.ViewAllTenantOfSelf,
      ],
    })
    @get(baseUrl, {
      security: OPERATION_SECURITY_SPEC,
      responses: {
        [STATUS_CODE.OK]: {
          description: 'Array of Tenant User is a part of',
          content: {
            'application/json': {
              schema: {type: 'array', items: getModelSchemaRef(Tenant)},
            },
          },
        },
      },
    })
    async find(
      @param.path.string('id') id: string,
      @param.query.object('filter') filter?: Filter<UserTenant>,
    ): Promise<Tenant[]> {
  
        // Check if the user can access the data
        if (id !== this.currentUser.id) {
            throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
        }

        // Find user tenants for the specified user ID
        const userTenants = await this.userTenantRepository.find({
            where: { userId: id },
        });

        // Extract tenant IDs from user tenants
        const tenantIds = userTenants.map(userTenant => userTenant.tenantId);

        // Find tenants based on the extracted tenant IDs
        const tenants = await this.tenantRepository.find({
            where: { id: { inq: tenantIds } },
        });

        return tenants;
    }
  
  }
  