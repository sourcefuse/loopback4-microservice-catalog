// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import type {SamlConfig, Strategy} from '@node-saml/passport-saml';
import {ILogger, LOGGER} from '@sourceloop/core';
import {Strategies} from 'loopback4-authentication';
import type {SamlStrategyFactory} from 'loopback4-authentication/SAML';
import type {SamlLogoutConfig, SamlSessionRef} from '../types';

/** Prefix that marks an externalAuthToken as a SAML session reference. */
export const SAML_SESSION_PREFIX = 'saml:';
/** NameID format used when the IdP omits the Format attribute. */
export const SAML_NAMEID_FORMAT_UNSPECIFIED =
  'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified';

export function encodeSamlSession(session: SamlSessionRef): string {
  return `${SAML_SESSION_PREFIX}${Buffer.from(JSON.stringify(session)).toString('base64url')}`;
}

export function isSamlSessionToken(token?: string | null): token is string {
  return !!token?.startsWith(SAML_SESSION_PREFIX);
}

/** Returns undefined for anything that is not a well-formed SAML session reference. */
export function decodeSamlSession(
  token?: string | null,
): SamlSessionRef | undefined {
  if (!isSamlSessionToken(token)) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(token.slice(SAML_SESSION_PREFIX.length), 'base64url').toString(
        'utf8',
      ),
    );
    if (
      typeof parsed?.nameID !== 'string' ||
      !parsed.nameID ||
      typeof parsed.nameIDFormat !== 'string'
    ) {
      return undefined;
    }
    return {
      nameID: parsed.nameID,
      nameIDFormat: parsed.nameIDFormat,
      sessionIndex:
        typeof parsed.sessionIndex === 'string'
          ? parsed.sessionIndex
          : undefined,
    };
  } catch {
    return undefined;
  }
}

/**
 * Single Logout settings, or undefined when SLO is not configured. Besides the
 * SAML login settings the stock SamlLoginController uses (SAML_ISSUER,
 * SAML_CERT, SAML_ENTRY_POINT, SAML_CALLBACK_URL, optional SAML_AUDIENCE) it
 * needs SAML_SESSION_LOGOUT_URL (IdP SLO endpoint), SAML_SP_PRIVATE_KEY (SP
 * signing key) and SAML_LOGOUT_REDIRECT_URL (page shown after logout). The key
 * is kept out of the login options on purpose: a privateKey makes node-saml
 * sign every request, and login AuthnRequests stay unsigned.
 */
export function readSamlLogoutConfig(): SamlLogoutConfig | undefined {
  const logoutUrl = process.env.SAML_SESSION_LOGOUT_URL;
  const privateKey = process.env.SAML_SP_PRIVATE_KEY?.replaceAll(
    String.raw`\n`,
    '\n',
  );
  const postLogoutRedirectUrl = process.env.SAML_LOGOUT_REDIRECT_URL;
  if (!logoutUrl || !privateKey || !postLogoutRedirectUrl) {
    return undefined;
  }
  const issuer = process.env.SAML_ISSUER;
  const idpCert = process.env.SAML_CERT?.replaceAll(String.raw`\n`, '\n');
  const entryPoint = process.env.SAML_ENTRY_POINT;
  const callbackUrl = process.env.SAML_CALLBACK_URL;
  // a LogoutRequest is only valid for the SP the login settings describe
  if (!issuer || !idpCert || !entryPoint || !callbackUrl) {
    return undefined;
  }
  const samlOptions: SamlConfig = {
    issuer,
    idpCert,
    entryPoint,
    callbackUrl,
    audience: process.env.SAML_AUDIENCE,
    logoutUrl,
    privateKey,
    signatureAlgorithm: 'sha256',
  };
  return {samlOptions, postLogoutRedirectUrl};
}

type LogoutRequest = Parameters<Strategy['logout']>[0];
// the fields node-saml's logout() reads: the session (user) and RelayState
// (query/body); typed so a shape change in the library fails at compile time
type LogoutRequestFields = Pick<LogoutRequest, 'user' | 'query' | 'body'>;

/**
 * Builds the signed SAML LogoutRequest URL (HTTP-Redirect binding) that ends
 * the user's IdP session. Returns null whenever Single Logout cannot or need
 * not happen — not a SAML session, SLO not configured, no SAML strategy
 * factory bound, or a signing failure — so the caller's local logout never
 * depends on the IdP.
 */
@injectable({scope: BindingScope.TRANSIENT})
export class SamlLogoutService {
  constructor(
    @inject.getter(Strategies.Passport.SAML_STRATEGY_FACTORY)
    private readonly getStrategyFactory: Getter<SamlStrategyFactory>,
    @inject(LOGGER.LOGGER_INJECT)
    private readonly logger: ILogger,
  ) {}

  async buildLogoutUrl(externalAuthToken?: string): Promise<string | null> {
    const session = decodeSamlSession(externalAuthToken);
    if (!session) {
      return null;
    }
    const config = readSamlLogoutConfig();
    if (!config) {
      this.logger.info(
        '[SamlLogout] Single Logout not configured; ending the local session only',
      );
      return null;
    }
    try {
      const strategy = (await this.getStrategyFactory())(config.samlOptions);
      const request: LogoutRequestFields = {
        user: {issuer: config.samlOptions.issuer, ...session},
        query: {},
        body: {},
      };
      return await new Promise<string | null>((resolve, reject) => {
        // a server-built request, not an HTTP one: only the fields above exist
        strategy.logout(request as LogoutRequest, (err, url) =>
          err ? reject(err) : resolve(url ?? null),
        );
      });
    } catch (error) {
      this.logger.error(
        `[SamlLogout] Could not build the SAML logout request :: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return null;
    }
  }
}
