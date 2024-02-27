import {BindingScope, inject, injectable} from '@loopback/context';
import {Count, Where, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {AuthorizeErrorKeys} from 'loopback4-authorization';
import {Role} from '../models';
import {RoleRepository, UserTenantRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class TenantOperationsService {
  constructor(
    @repository(RoleRepository) protected roleRepository: RoleRepository,
    @inject(AuthenticationBindings.CURRENT_USER)
    protected currentUser: IAuthUserWithPermissions,
    @repository(UserTenantRepository)
    readonly userTenantRepository: UserTenantRepository,
  ) {}

  async createRole(tenantId: string, role: Omit<Role, 'id'>): Promise<Role> {
    const roleInDb = await this.roleRepository.findOne({
      where: {
        name: role.name,
      },
    });
    if (roleInDb) {
      throw new HttpErrors.Forbidden(' Role with same name already exist');
    }
    role.tenantId = tenantId ?? '';

    const isAllowed = this._isAllowed(role);
    if (!isAllowed)
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    return this.roleRepository.create(role);
  }

  async updateRole(
    id: string,
    role: Partial<Role>,
    where: Where<Role> | undefined,
  ): Promise<Count> {
    role.tenantId = id;

    const isAllowed = this._isAllowed(role);
    if (!isAllowed)
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    return this.roleRepository.updateAll(role, where);
  }
  async deleteRole(tenantId: string, roleId: string): Promise<void> {
    const role = await this.roleRepository.findById(roleId);

    const isAllowed = this._isAllowed(role);
    const userTenant = await this.userTenantRepository.findById(
      this.currentUser.userTenantId,
    );
    if (userTenant.roleId === roleId || !isAllowed) {
      throw new HttpErrors.Forbidden('Not Allowed');
    }
    return this.roleRepository.deleteById(roleId);
  }
  // it check whether user has all the permission that he/she is trying to Edit/Create/Delete
  private _isAllowed(role: Partial<Role>): Boolean {
    const isAllowed =
      role.permissions?.every(permission =>
        this.currentUser.permissions.includes(permission),
      ) ?? true;
    return isAllowed;
  }
}
