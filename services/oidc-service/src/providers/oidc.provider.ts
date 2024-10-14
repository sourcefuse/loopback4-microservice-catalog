import {
  BindingScope,
  ContextTags,
  Provider,
  inject,
  injectable,
} from '@loopback/core';
import {repository} from '@loopback/repository';

import OidcProvider, {
  Configuration,
  FindAccount,
  ResponseType,
} from 'oidc-provider';
import {FindAccountProvider} from '.';
import {OIDCServiceBindings} from '../keys';
import {AuthClientRepository, UserRepository} from '../repositories';

const defaultClaims = ['firstName', 'lastName', 'email'];
const claimsProfile =
  process.env.OIDC_CLAIMS_PROFILE?.split(',') ?? defaultClaims;
const oneHour = '3600';

export const jwks = {
  keys: [
    {
      kty: process.env.OIDC_JWKS_KTY,
      alg: process.env.OIDC_JWKS_ALG,
      use: process.env.OIDC_JWKS_USE,
      d: process.env.OIDC_JWKS_D,
      dp: process.env.OIDC_JWKS_DP,
      dq: process.env.OIDC_JWKS_DQ,
      e: process.env.OIDC_JWKS_E,
      n: process.env.OIDC_JWKS_N,
      p: process.env.OIDC_JWKS_P,
      q: process.env.OIDC_JWKS_Q,
      qi: process.env.OIDC_JWKS_QI,
      kid: process.env.OIDC_JWKS_KID,
    },
  ],
};

const cookies = {
  keys: [process.env.OIDC_COOKIES ?? ''],
};

@injectable({
  scope: BindingScope.SINGLETON,
  tags: {[ContextTags.KEY]: OIDCServiceBindings.OIDC_PROVIDER},
})
export class OidcProviderProvider implements Provider<OidcProvider> {
  constructor(
    @inject(`repositories.AuthClientRepository`)
    private readonly authClientRepository: AuthClientRepository,
    @inject(OIDCServiceBindings.FIND_ACCOUNT_PROVIDER)
    private readonly findAccountProvider: FindAccountProvider,
    @repository(UserRepository)
    protected readonly userRepository: UserRepository,
  ) {}

  async value(): Promise<OidcProvider> {
    // Retrieve the client configurations from the AuthClientRepository
    const allClients = await this.authClientRepository.find();
    const config: Configuration = {
      clients: allClients.map(client => {
        // default Values
        const defaultGrantTypes = ['authorization_code', 'implicit'];
        const defaultResponseTypes = ['code', 'id_token'];
        const defaultRedirectUris = ['https://oidcdebugger.com/debug'];
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
          client_id: client.clientId,
          client_secret: client.clientSecret,
          grant_types: client.grantTypes ?? defaultGrantTypes,
          response_types:
            client.responseTypes?.map(type => type as ResponseType) ??
            defaultResponseTypes?.map(type => type as ResponseType),
          redirect_uris: client.redirectUrl?.split(',') ?? defaultRedirectUris,
          // ... other client properties
        };
      }),
      pkce: {
        methods: ['S256'],
        required: () => false,
      },
      features: {
        devInteractions: {enabled: false}, // defaults to true
      },
      claims: {
        openid: claimsProfile,
        //  ... other claims
      },
      jwks: jwks,
      cookies: cookies,
      // sonarignore:start
      ttl: {
        /* eslint-disable @typescript-eslint/naming-convention */
        Interaction: (ctx, interaction) => {
          const expirationInSeconds = parseInt(
            process.env.OIDC_INTERACTION_TIME ?? oneHour,
          );
          return expirationInSeconds;
        },
        Session: (ctx, session) => {
          const sessionExpirationInSeconds = parseInt(
            process.env.OIDC_SESSION_TIME ?? oneHour,
          );
          return sessionExpirationInSeconds;
        },
        Grant: (ctx, grant) => {
          const grantExpirationInSeconds = parseInt(
            process.env.OIDC_GRANT_TIME ?? oneHour,
          );
          return grantExpirationInSeconds;
        },
        IdToken: (ctx, client, accountId) => {
          const idTokenExpirationInSeconds = parseInt(
            process.env.OIDC_ID_TOKEN_TIME ?? oneHour,
          );
          return idTokenExpirationInSeconds;
        },
      },
      findAccount: this.findAccountProvider as unknown as FindAccount,
      // sonarignore:end
    };

    const oidcProvider = new OidcProvider(
      process.env.OIDC_ISSUER_URL ?? 'http://localhost:3000',
      config,
    );

    return oidcProvider;
  }
}
