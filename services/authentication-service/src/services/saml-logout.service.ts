// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BindingScope, Getter, inject, injectable} from '@loopback/core';
import type {SamlConfig, Strategy} from '@node-saml/passport-saml';
import {ILogger, LOGGER} from '@sourceloop/core';
import {Strategies} from 'loopback4-authentication';
import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
} from 'node:crypto';
import type {SamlStrategyFactory} from 'loopback4-authentication/SAML';
import type {SamlLogoutConfig, SamlSessionRef} from '../types';

/** Prefix that marks an externalAuthToken as a SAML session reference. */
export const SAML_SESSION_PREFIX = 'saml:';
/** NameID format used when the IdP omits the Format attribute. */
export const SAML_NAMEID_FORMAT_UNSPECIFIED =
  'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified';

const SESSION_CIPHER = 'aes-256-gcm';
const SESSION_IV_BYTES = 12;
const SESSION_TAG_BYTES = 16;
const SESSION_KEY_BYTES = 32;
const SESSION_KEY_INFO = 'sourceloop:saml-session-ref';

function deriveSessionKey(secret: string): Buffer {
  return Buffer.from(
    hkdfSync(
      'sha256',
      secret,
      Buffer.alloc(0),
      SESSION_KEY_INFO,
      SESSION_KEY_BYTES,
    ),
  );
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

/**
 * Encrypts the IdP session reference (AES-256-GCM) so it stays opaque wherever
 * externalAuthToken travels — with the default code writer that includes the
 * authorization code in the login redirect URL.
 */
export function encodeSamlSession(
  session: SamlSessionRef,
  secret: string,
): string {
  const iv = randomBytes(SESSION_IV_BYTES);
  const cipher = createCipheriv(SESSION_CIPHER, deriveSessionKey(secret), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(session), 'utf8'),
    cipher.final(),
  ]);
  return `${SAML_SESSION_PREFIX}${Buffer.concat([
    iv,
    cipher.getAuthTag(),
    ciphertext,
  ]).toString('base64url')}`;
}

export function isSamlSessionToken(token?: string | null): token is string {
  return !!token?.startsWith(SAML_SESSION_PREFIX);
}

/**
 * Returns undefined for anything that is not a SAML session reference
 * encrypted with this secret (including references made before a key rotation).
 */
export function decodeSamlSession(
  token: string | null | undefined,
  secret: string,
  logger?: ILogger,
): SamlSessionRef | undefined {
  if (!isSamlSessionToken(token) || !secret) {
    return undefined;
  }
  const raw = Buffer.from(token.slice(SAML_SESSION_PREFIX.length), 'base64url');
  if (raw.length <= SESSION_IV_BYTES + SESSION_TAG_BYTES) {
    logger?.warn('[SamlLogout] SAML session reference is truncated');
    return undefined;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(decryptSessionRef(raw, secret));
  } catch (error) {
    // a wrong or rotated key, tampering and corruption all end here; log the
    // error class only, never the token or the secret
    logger?.warn(
      `[SamlLogout] SAML session reference could not be decrypted :: ${
        error instanceof Error ? error.name : typeof error
      }`,
    );
    return undefined;
  }
  const session = toSessionRef(parsed);
  if (!session) {
    logger?.warn('[SamlLogout] SAML session reference has an unexpected shape');
  }
  return session;
}

/** AES-256-GCM decrypt; throws when the key is wrong or the data was altered. */
function decryptSessionRef(raw: Buffer, secret: string): string {
  const decipher = createDecipheriv(
    SESSION_CIPHER,
    deriveSessionKey(secret),
    raw.subarray(0, SESSION_IV_BYTES),
  );
  decipher.setAuthTag(
    raw.subarray(SESSION_IV_BYTES, SESSION_IV_BYTES + SESSION_TAG_BYTES),
  );
  return Buffer.concat([
    decipher.update(raw.subarray(SESSION_IV_BYTES + SESSION_TAG_BYTES)),
    decipher.final(),
  ]).toString('utf8');
}

function toSessionRef(parsed: unknown): SamlSessionRef | undefined {
  const value = parsed as Record<string, unknown> | null;
  if (
    typeof value?.nameID !== 'string' ||
    !value.nameID ||
    typeof value.nameIDFormat !== 'string'
  ) {
    return undefined;
  }
  return {
    nameID: value.nameID,
    nameIDFormat: value.nameIDFormat,
    sessionIndex: optionalString(value.sessionIndex),
    nameQualifier: optionalString(value.nameQualifier),
    spNameQualifier: optionalString(value.spNameQualifier),
  };
}

/** PEM values arrive in env vars with literal "\n" sequences for line breaks. */
function unescapeNewlines(value?: string): string | undefined {
  // split/join rather than replaceAll: the package targets a pre-ES2021 lib
  return value?.split(String.raw`\n`).join('\n');
}

/**
 * Single Logout settings, or undefined when SLO is not configured. Besides the
 * SAML login settings the stock SamlLoginController uses (SAML_ISSUER,
 * SAML_CERT, SAML_ENTRY_POINT, SAML_CALLBACK_URL, optional SAML_AUDIENCE) it
 * needs SAML_SESSION_LOGOUT_URL (IdP SLO endpoint), SAML_SP_PRIVATE_KEY (SP
 * signing key) and SAML_LOGOUT_REDIRECT_URL (page shown after logout). The key
 * is kept out of the login options on purpose: a privateKey makes node-saml
 * sign every request, and login AuthnRequests stay unsigned. The same key also
 * encrypts the stored session reference.
 */
export function readSamlLogoutConfig(): SamlLogoutConfig | undefined {
  const logoutUrl = process.env.SAML_SESSION_LOGOUT_URL;
  const privateKey = unescapeNewlines(process.env.SAML_SP_PRIVATE_KEY);
  const postLogoutRedirectUrl = process.env.SAML_LOGOUT_REDIRECT_URL;
  if (!logoutUrl || !privateKey || !postLogoutRedirectUrl) {
    return undefined;
  }
  const issuer = process.env.SAML_ISSUER;
  const idpCert = unescapeNewlines(process.env.SAML_CERT);
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
  return {samlOptions, postLogoutRedirectUrl, sessionSecret: privateKey};
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

  async buildLogoutUrl(
    externalAuthToken?: string,
    userId?: string,
  ): Promise<string | null> {
    if (!isSamlSessionToken(externalAuthToken)) {
      return null;
    }
    const config = readSamlLogoutConfig();
    if (!config) {
      this.logger.warn(
        `[SamlLogout] Single Logout not configured; ending the local session only :: userId=${userId}`,
      );
      return null;
    }
    const session = decodeSamlSession(
      externalAuthToken,
      config.sessionSecret,
      this.logger,
    );
    if (!session) {
      this.logger.warn(
        `[SamlLogout] SAML session reference unreadable; ending the local session only :: userId=${userId}`,
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
        `[SamlLogout] Could not build the SAML logout request :: userId=${userId} :: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return null;
    }
  }
}
