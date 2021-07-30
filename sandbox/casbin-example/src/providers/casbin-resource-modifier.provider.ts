import {Getter, inject, Provider} from '@loopback/context';
import {HttpErrors, Request} from '@loopback/rest';
import {
  AuthorizationBindings,
  AuthorizationMetadata,
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
  ) {}

  value(): CasbinResourceModifierFn {
    return (pathParams: string[], req: Request) => this.action(pathParams, req);
  }

  async action(pathParams: string[], req: Request): Promise<string> {
    const metadata: AuthorizationMetadata = await this.getCasbinMetadata();

    if (
      !metadata &&
      !!this.allowAlwaysPath.find(path => req.path.indexOf(path) === 0)
    ) {
      return '';
    }

    if (!metadata) {
      throw new HttpErrors.InternalServerError(`Metadata object not found`);
    }
    const res = metadata.resource;

    // Now modify the resource parameter using on path params, as per business logic.
    // Returning resource value as such for default case.

    return `${res}`;
  }
}
