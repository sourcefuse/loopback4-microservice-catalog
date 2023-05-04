/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import Provider, {ClaimsParameterMember, Configuration} from 'oidc-provider';
import express from 'express';
const oidcProviderApp = express();

const config: Configuration = {
  clients: [
    {
      redirect_uris: [ "https://oidcdebugger.com/debug"],
      response_types: ["code",'id_token'],
      client_id: "oidcCLIENT",
      client_secret: "Some_super_secret",
      grant_types: ["authorization_code", "implicit"],
      // ... other client properties
    },
  ],
  pkce: {
    methods: [
      'S256',
      'plain'
    ],
   required: () => false,
  },
  features: {
    devInteractions: { enabled: false }, // defaults to true
  },
  claims: {
    profile: ['firstname', 'lastname', 'email'],
    scopeA: ['claim1', 'claim2'],
  },
  async findAccount(ctx: unknown, sub: string, token: unknown) {
    const app = await oidcProviderApp.get('ctx');
    const userRepo = await app.get('repositories.UserRepository');
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
      async claims(use: string, scope: string, claims: {[key: string]: ClaimsParameterMember}, rejected: Array<string>) {
        return {sub: sub, firstname: firstName, lastname: lastName, email: email};
      },
    }
  },

};

export const oidcProvider = new Provider('http://localhost:3000', config);


oidcProviderApp.use('/oidc',oidcProvider.callback());

export {oidcProviderApp};