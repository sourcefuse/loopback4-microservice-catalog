import {Getter, inject, Provider} from '@loopback/context';
import {Request} from 'express';
import {intersection} from 'lodash';
import {
  AuthorizationBindings,
  AuthorizationMetadata,
  AuthorizeFn,
} from 'loopback4-authorization';

export class AuthorizeActionProvider implements Provider<AuthorizeFn> {
  constructor(
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getMetadata: Getter<AuthorizationMetadata>,
    @inject(AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS)
    private readonly allowAlwaysPath: string[],
  ) {}

  value(): AuthorizeFn {
    return (response, req) => this.action(response, req);
  }

  async action(userPermissions: string[], request?: Request): Promise<boolean> {
    const metadata: AuthorizationMetadata = await this.getMetadata();
    if (request && this.checkIfAllowedAlways(request)) {
      return true;
    } else if (!metadata) {
      return false;
    } else if (metadata.permissions.indexOf('*') === 0) {
      // Return immediately with true, if allowed to all
      // This is for publicly open routes only
      return true;
    }
    const permissionsToCheck = metadata.permissions;
    return (
      intersection(userPermissions, permissionsToCheck).length > 0 &&
      this.checkCustomPermission(userPermissions, request)
    );
  }

  checkIfAllowedAlways(req: Request): boolean {
    let allowed = false;
    allowed = !!this.allowAlwaysPath.find(path => req.path.indexOf(path) === 0);
    return allowed;
  }

  checkCustomPermission(userPermissions: string[], request?: Request): boolean {
    //write the logic for custom permissions here, for now returning true
    return true;
  }
}
