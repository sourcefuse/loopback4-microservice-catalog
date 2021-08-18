import {Getter, inject, Provider} from '@loopback/context';
import {HttpErrors, Request, RestBindings} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {
  AuthorizationBindings,
  AuthorizationMetadata,
  AuthorizeErrorKeys,
  CasbinResourceModifierFn,
} from 'loopback4-authorization';

export class CasbinResValModifierProvider
  implements Provider<CasbinResourceModifierFn>
{
  constructor(
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getCasbinMetadata: Getter<AuthorizationMetadata>,
    @inject(AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS)
    private readonly allowAlwaysPath: string[],
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
    @inject(RestBindings.Http.REQUEST) private readonly request: Request,
  ) {}

  value(): CasbinResourceModifierFn {
    return (pathParams: string[]) => this.action(pathParams);
  }

  async action(pathParams: string[]): Promise<string> {
    const metadata: AuthorizationMetadata = await this.getCasbinMetadata();
    const allowedPath = this.allowAlwaysPath.find(
      path => this.request.path.indexOf(path) === 0,
    );
    if (allowedPath) {
      return this.request.path;
    }

    if (!metadata) {
      this.logger.error('Metadata for authorization not found');
      throw new HttpErrors.Forbidden(AuthorizeErrorKeys.NotAllowedAccess);
    }

    const resIds: string[] = [];
    for (const pathParam of pathParams) {
      if (typeof pathParam === 'string') {
        resIds.push(pathParam);
      }
    }

    if (resIds.length) {
      return resIds.join(',');
    } else {
      return '*';
    }
  }
}
