import {Provider, inject, Getter} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {IAuthUserWithPermissions, ILogger, LOGGER} from '@sourceloop/core';
import {
  CasbinAuthorizeFn,
  AuthorizationBindings,
  AuthorizationMetadata,
  CasbinEnforcerConfigGetterFn,
  ResourcePermissionObject,
  CasbinConfig,
  AuthorizeErrorKeys,
} from 'loopback4-authorization';

import * as casbin from 'casbin';

export class CasbinAuthorizationProvider
  implements Provider<CasbinAuthorizeFn>
{
  constructor(
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getCasbinMetadata: Getter<AuthorizationMetadata>,
    @inject(AuthorizationBindings.CASBIN_ENFORCER_CONFIG_GETTER)
    private readonly getCasbinEnforcerConfig: CasbinEnforcerConfigGetterFn,
    @inject(AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS)
    private readonly allowAlwaysPath: string[],
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {}

  value(): CasbinAuthorizeFn {
    return (response, resource, request) =>
      this.action(response, resource, request);
  }

  async action(
    user: IAuthUserWithPermissions,
    resource: string,
    request?: Request,
  ): Promise<boolean> {
    let authDecision = false;
    // fetch decorator metadata
    const metadata: AuthorizationMetadata = await this.getCasbinMetadata();

    if (request && this.checkIfAllowedAlways(request)) {
      return true;
    }
    if (!metadata) {
      this.logger.error('Metadata for authorization not found');
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    if (metadata.permissions.indexOf('*') === 0) {
      // Return immediately with true, if allowed to all
      // This is for publicly open routes only
      return true;
    }
    const subject = this.getUserName(`${user.id}`);
    const desiredPermissions = metadata.permissions;
    if (!desiredPermissions.length) {
      this.logger.error('Metadata for authorization not found or invalid');
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }

    try {
      // Fetch casbin config by invoking casbin-config-getter-provider
      const casbinConfig = await this.getCasbinEnforcerConfig(user, resource);
      const enforcer = await this.getEnforcer(metadata, casbinConfig, subject);
      // If casbin config policy format is being used, create enforcer
      const resourceIds = resource.split(',');
      authDecision = await this.makeDecision(
        resourceIds,
        desiredPermissions,
        enforcer,
        subject,
        authDecision,
      );
    } catch (err) {
      this.logger.error(`Error while doing casbin action. Error :: ${err}`);
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }

    return authDecision;
  }

  // Generate the user name according to the naming convention
  // in casbin policy
  // A user's name would be `u${ id }`
  getUserName(id: string): string {
    return `u${id}`;
  }

  async makeDecision(
    resourceIds: string[],
    desiredPermissions: string[],
    enforcer: casbin.Enforcer,
    subject: string,
    authDecision: boolean,
  ) {
    let decision = authDecision ?? false;
    for (const resourceId of resourceIds) {
      for (const permission of desiredPermissions) {
        decision = await enforcer.enforce(subject, permission, resourceId);
        if (decision) {
          break;
        }
      }
    }
    return decision;
  }
  createCasbinPolicy(
    resPermObj: ResourcePermissionObject[],
    subject: string,
  ): string {
    let result = '';
    resPermObj.forEach(resPerm => {
      const policy = `p, ${subject}, ${resPerm.permission}, ${resPerm.resource}
        `;
      result += policy;
    });

    return result;
  }
  async getEnforcer(
    metadata: AuthorizationMetadata,
    casbinConfig: CasbinConfig,
    subject: string,
  ) {
    let enforcer: casbin.Enforcer;
    if (metadata.isCasbinPolicy) {
      enforcer = await casbin.newEnforcer(
        casbinConfig.model,
        casbinConfig.policy,
      );
    }
    // In case casbin policy is coming via provider, use that to initialise enforcer
    else if (!metadata.isCasbinPolicy && casbinConfig.allowedRes) {
      const policy = this.createCasbinPolicy(casbinConfig.allowedRes, subject);

      const stringAdapter = new casbin.StringAdapter(policy);
      enforcer = new casbin.Enforcer();
      if (typeof casbinConfig.model !== 'string') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        enforcer.initWithModelAndAdapter(casbinConfig.model, stringAdapter);
      }
    } else {
      this.logger.error('Metadata for authorization not found or invalid');
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }
    return enforcer;
  }
  checkIfAllowedAlways(req: Request): boolean {
    let allowed = false;
    allowed = !!this.allowAlwaysPath.find(
      allowPath => req.path.indexOf(allowPath) === 0,
    );
    return allowed;
  }
}
