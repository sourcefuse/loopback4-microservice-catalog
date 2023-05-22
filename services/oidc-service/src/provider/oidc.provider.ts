import {
  Provider,
  BindingScope,
  inject,
  BindingKey,
  ContextTags,
  injectable,
} from '@loopback/core';
import {
  repository
} from '@loopback/repository';
import OidcProvider, {Configuration, ResponseType} from 'oidc-provider';
import {AuthClientRepository, UserRepository} from '../repositories';

export const OIDC_PROVIDER =
  BindingKey.create<OidcProvider>('sf.oidc.provider');

@injectable({
  scope: BindingScope.SINGLETON,
  tags: {[ContextTags.KEY]: OIDC_PROVIDER}
})
export class OidcProviderProvider implements Provider<OidcProvider> {
 
  constructor(
    @inject(`repositories.AuthClientRepository`)
    private authClientRepository: AuthClientRepository,
    @repository(UserRepository)
    protected readonly userRepository: UserRepository,
  ) {}

  async value(): Promise<OidcProvider> {
    const userRepo = this.userRepository;
    // Retrieve the client configurations from the AuthClientRepository
    const allClients = await this.authClientRepository.find();
    const config: Configuration = {
      clients: allClients.map(client => {
       
        // default Values
        const defaultGrantTypes = ['authorization_code', 'implicit'];
        const defaultResponseTypes = ['code', 'id_token'];
        const defaultRedirectUris = ['https://oidcdebugger.com/debug'];
    
        return {
          client_id: client.clientId,
          client_secret: client.clientSecret,
          grant_types: client.grantTypes || defaultGrantTypes,
          response_types: client.responseTypes?.map(type => type as ResponseType) || defaultResponseTypes?.map(type => type as ResponseType), // Convert to ResponseType enum
          redirect_uris: client.redirectUris || defaultRedirectUris,
          // ... other client properties
        };
      }),
      pkce: {
        methods: [
          'S256'
        ],
       required: () => false,
      },
      features: {
        devInteractions: { enabled: false }, // defaults to true
      },
      claims: {
        profile: process.env.OIDC_CLAIMS_PROFILE?.split(',') || ['firstname', 'lastname', 'email'],
        //  ... other claims      
      },
      async findAccount(ctx: unknown, sub: string, token: unknown) {
        const newUser = await userRepo.find({where:{username:sub}});
        const {email, firstName, lastName} = newUser[0];
        return {
          accountId: sub,
          // @param use {string} - can either be "id_token" or "userinfo", depending on
          //   where the specific claims are intended to be put in
          // @param scope {string} - the intended scope, while oidc-provider will mask
          //   claims depending on the scope automatically you might want to skip
          //   loading some claims from external resources or through db projection etc. based on this
          //   detail or not return them in ID Tokens but only UserInfo and so on
          // @param claims {object} - the part of the claims authorization parameter for either
          //   "id_token" or "userinfo" (depends on the "use" param)
          // @param rejected {Array[String]} - claim names that were rejected by the end-user, you might
          //   want to skip loading some claims from external resources or through db projection
          async claims(use: string, scope: string, claims: unknown, rejected: Array<string>) {
            return {sub: sub, firstname: firstName, lastname: lastName, email: email};
          },
        }
      },
    
    };

    const oidcProvider = new OidcProvider(
      'https://your-issuer-url.com',
      config,
    );

    return oidcProvider;
  }
}

