// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {stripVTControlCharacters} from 'node:util';
import {TOKEN_VAR} from './requests';
import type {MaskOptions} from '../../types';

/** The text that replaces a secret when `mask.replacement` is not set. */
export const DEFAULT_MASK = '<masked>';

/** A secret that is shorter than this is not masked: it would hide normal text. */
const MIN_SECRET_LENGTH = 8;

/** The names whose value is always masked, in a line `name: value`. */
const BUILT_IN_NAMES = [
  TOKEN_VAR,
  'authorization',
  'access_token',
  'refresh_token',
  'id_token',
  'cookie',
  'set-cookie',
  'password',
  'secret',
  'api-key',
  'x-api-key',
];

const JWT = /eyJ[\w-]+\.[\w-]+\.[\w-]*/g;
const BEARER = /\b(Bearer|Basic)\s+[\w.~+/=-]+/gi;

const escape = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

/** A secret as it is written plain, in base64, and in a URL. */
function formsOf(secret: string): string[] {
  return [
    secret,
    Buffer.from(secret).toString('base64'),
    encodeURIComponent(secret),
  ];
}

/**
 * Makes the function that hides the secrets of one line of output. The
 * built-in rules (the tokens, JWTs, Bearer values, and the names above)
 * always run. The rules of `options` run after them, and `custom` runs last:
 * they can only hide more. A line is cut of colour codes first, so that
 * a code cannot split a secret.
 */
export function createMasker(
  tokens: string[],
  options: MaskOptions = {},
): (line: string) => string {
  const replacement = options.replacement ?? DEFAULT_MASK;
  // A Set drops a secret that was given twice, for example a token that two users share.
  const literals = [
    ...new Set(
      [...tokens, ...(options.secrets ?? [])]
        .filter(secret => secret.length >= MIN_SECRET_LENGTH)
        .flatMap(formsOf),
    ),
  ]
    // The longest first, so that a secret inside another one is not left half shown.
    .sort((a, b) => b.length - a.length);
  const names = [
    ...new Set(
      [...BUILT_IN_NAMES, ...(options.names ?? [])].map(name =>
        name.toLowerCase(),
      ),
    ),
  ];
  const literalRule =
    literals.length > 0
      ? new RegExp(literals.map(escape).join('|'), 'g')
      : undefined;
  const nameRule = new RegExp(
    String.raw`(["']?(?:${names.map(escape).join('|')})["']?\s*[:=]\s*)[^\r\n]*`,
    'gi',
  );
  const patterns = (options.patterns ?? []).map(
    p => new RegExp(p.source, p.flags.includes('g') ? p.flags : `${p.flags}g`),
  );

  return line => {
    try {
      let out = stripVTControlCharacters(line);
      // Function replacers: a `$&` in `replacement` must not read as a pattern.
      const hide = () => replacement;
      if (literalRule) out = out.replace(literalRule, hide);
      out = out
        .replace(JWT, hide)
        .replace(BEARER, (_, scheme: string) => `${scheme} ${replacement}`)
        .replace(nameRule, (_, head: string) => head + replacement);
      for (const pattern of patterns) out = out.replace(pattern, hide);
      return options.custom ? options.custom(out) : out;
    } catch {
      // A rule that fails must not show the line.
      return replacement;
    }
  };
}
