import {Getter, inject, Provider} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {
  AuthorizationBindings,
  AuthorizationMetadata,
  CasbinResourceModifierFn
} from 'loopback4-authorization';

export class CasbinResValModifierProvider
  implements Provider<CasbinResourceModifierFn> {
  constructor(
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getCasbinMetadata: Getter<AuthorizationMetadata>,
  ) {}

  value(): CasbinResourceModifierFn {
    return (pathParams: string[]) => this.action(pathParams);
  }

  async action(pathParams: string[]): Promise<string> {
    const metadata: AuthorizationMetadata = await this.getCasbinMetadata();
    if (!metadata) {
      throw new HttpErrors.InternalServerError(`Metadata object not found`);
    }
    const res = metadata.resource;

    // Now modify the resource parameter using on path params, as per application needs.
    // For now, returning as such (for the basic case)

    return `${res}`;
  }
}
