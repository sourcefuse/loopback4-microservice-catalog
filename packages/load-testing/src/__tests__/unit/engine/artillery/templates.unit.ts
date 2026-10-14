// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {expect} from '@loopback/testlab';
import {
  TEMPLATE_AT_SOURCE,
  checkBaseUrl,
  checkRunVars,
  checkToken,
  templateAt,
} from '../../../../engine/artillery/templates';
import {artillery} from '../../../../engine/artillery';
import {RunError} from '../../../../errors';
import {load} from '../../../../scenario/builder';
import {scenarioOf} from '../../../helpers';

describe('checkRunVars', () => {
  const message = (where: string) =>
    `${where} contains text that the engine reads as a template ("{{", "$&", "$\`", "$'" or "$$"). Put the value in vars without it, or leave it out.`;
  const PATTERNS = ['{{ x }}', 'a$&b', 'a$`b', "a$'b", 'pa$$word'];

  it('accepts vars that have no braces, and values that are not text', () => {
    expect(() =>
      checkRunVars({
        id: 'd1',
        count: 3,
        flag: true,
        none: null,
        ids: ['a', 'b'],
        order: {note: '{ not a template }', lines: [{sku: 'x'}]},
      }),
    ).to.not.throw();
  });

  it('refuses a text with braces, and names its path', () => {
    expect(() => checkRunVars({x: '{{ x }}'})).to.throw(RunError, {
      message: message('vars.x'),
    });
  });

  it('names the path in a nested object, and in an array', () => {
    expect(() => checkRunVars({order: {note: 'a {{ b }}'}})).to.throw(
      message('vars.order.note'),
    );
    expect(() => checkRunVars({ids: ['ok', '{{ $env.PATH }}']})).to.throw(
      message('vars.ids[1]'),
    );
    expect(() => checkRunVars({a: [{b: ['{{ c }}']}]})).to.throw(
      message('vars.a[0].b[0]'),
    );
  });

  for (const text of PATTERNS) {
    it(`refuses the text ${text} in a value and in a key`, () => {
      expect(() => checkRunVars({x: [text]})).to.throw(message('vars.x[0]'));
      expect(() => checkRunVars({[text]: 1})).to.throw(message(`vars.${text}`));
    });
  }

  it('throws a TypeError about a cycle, and does not overflow the stack', () => {
    const vars: Record<string, unknown> = {a: 1};
    vars.self = vars;

    expect(() => checkRunVars(vars)).to.throw(TypeError, /circular/);
  });

  it('checks the result of toJSON, because the processor holds that text', () => {
    expect(() => checkRunVars({x: {toJSON: () => ({y: '{{ x }}'})}})).to.throw(
      message('vars.x.y'),
    );
  });

  it('skips a value undefined, and lets a Date pass', () => {
    expect(() =>
      checkRunVars({a: undefined, when: new Date(0)}),
    ).to.not.throw();
  });

  it('refuses a key of an object that has braces', () => {
    expect(() => checkRunVars({order: {'{{ x }}': 1}})).to.throw(
      message('vars.order.{{ x }}'),
    );
  });
});

describe('checkToken', () => {
  const message = `The access token contains text that the engine reads as a template ("{{", "$&", "$\`", "$'" or "$$"). Log in again to get another token.`;

  it('lets a clean token and a missing token pass', () => {
    expect(() => checkToken('eyJ.abc-1_2.sig')).to.not.throw();
    expect(() => checkToken(undefined)).to.not.throw();
  });

  for (const text of ['ab{{c', 'ab$&c', 'ab$$c']) {
    it(`refuses a token with ${text.slice(2, 4)}, and does not print it`, () => {
      expect(() => checkToken(text)).to.throw(RunError, {message});
    });
  }
});

describe('the text copy of templateAt', () => {
  const copy = new Function(
    `${TEMPLATE_AT_SOURCE}; return loadTestsTemplateAt`,
  )() as (value: unknown, path: string) => string | undefined;
  const bare = Object.create(null) as Record<string, unknown>;
  bare.note = 'a$&b';
  const refused: [string, unknown][] = [
    ['text with braces', '{{ x }}'],
    ['text with $&', 'a$&b'],
    ['text with $`', 'a$`b'],
    ["text with $'", "a$'b"],
    ['text with $$', 'pa$$word'],
    ['a nested path', {order: {notes: ['ok', '{{ x }}']}}],
    ['an array', ['ok', ['a$&b']]],
    ['a key with braces', {'{{ k }}': 1}],
    ['an object without prototype', bare],
  ];
  const accepted: [string, unknown][] = [
    ['a plain text', 'abc'],
    ['a text with $1', 'a$1b'],
    ['a single brace', '{ x }'],
    ['null', null],
    ['a number', 7],
    ['a boolean', true],
    ['an empty array', []],
    ['an object without prototype and no pattern', Object.create(null)],
  ];

  for (const [name, value] of [...refused, ...accepted]) {
    it(`gives the same result as templateAt for ${name}`, () => {
      expect(copy(value, 'vars')).to.equal(templateAt(value, 'vars'));
    });
  }

  it('finds the path for each refused input, and none for the others', () => {
    for (const [, value] of refused) {
      expect(templateAt(value, 'vars')).to.be.a.String();
    }
    for (const [, value] of accepted) {
      expect(templateAt(value, 'vars')).to.be.undefined();
    }
  });
});

describe('checkBaseUrl', () => {
  const message = `The base URL contains text that the engine reads as a template ("{{", "$&", "$\`", "$'" or "$$"). Use a URL without it.`;

  it('lets a clean URL pass', () => {
    expect(() => checkBaseUrl('http://127.0.0.1:4014')).to.not.throw();
  });

  for (const text of ['{{ x }}', '$&', "$'", '$$']) {
    it(`refuses a URL with ${text}, and does not print it`, () => {
      expect(() => checkBaseUrl(`http://h/${text}`)).to.throw(RunError, {
        message,
      });
    });
  }
});

describe('the Artillery engine and the base URL', () => {
  it('refuses a base URL with a $ pattern before it writes any file', async () => {
    const pkgDir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-url-'));
    try {
      const run = artillery().run({
        pkgDir,
        scenario: scenarioOf('loop', [load.get('/a')]),
        config: {phases: [{duration: 1, arrivalRate: 1}]},
        phases: [{duration: 1, arrivalRate: 1}],
        runVars: {},
        endpointIds: ['GET /a'],
        baseUrl: 'http://127.0.0.1:1/$&',
        signal: new AbortController().signal,
      });

      await expect(run).to.be.rejectedWith({name: 'RunError'});
      expect(fs.readdirSync(pkgDir)).to.deepEqual([]);
    } finally {
      fs.rmSync(pkgDir, {recursive: true, force: true});
    }
  });
});

describe('the Artillery engine and the access token', () => {
  it('refuses a token with a $ pattern before it writes any file, and does not print it', async () => {
    const pkgDir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-tok-'));
    try {
      const run = artillery().run({
        pkgDir,
        scenario: scenarioOf('loop', [load.get('/a')]),
        config: {phases: [{duration: 1, arrivalRate: 1}]},
        phases: [{duration: 1, arrivalRate: 1}],
        runVars: {},
        endpointIds: ['GET /a'],
        baseUrl: 'http://127.0.0.1:1',
        token: 'abc$&def',
        signal: new AbortController().signal,
      });

      await expect(run).to.be.rejectedWith({
        name: 'RunError',
        message: `The access token contains text that the engine reads as a template ("{{", "$&", "$\`", "$'" or "$$"). Log in again to get another token.`,
      });
      expect(fs.readdirSync(pkgDir)).to.deepEqual([]);
    } finally {
      fs.rmSync(pkgDir, {recursive: true, force: true});
    }
  });
});

describe('the Artillery engine and the vars of before', () => {
  it('refuses a var with braces before it writes any file', async () => {
    const pkgDir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-tpl-'));
    try {
      const run = artillery().run({
        pkgDir,
        scenario: scenarioOf('loop', [load.get('/a')]),
        config: {phases: [{duration: 1, arrivalRate: 1}]},
        phases: [{duration: 1, arrivalRate: 1}],
        runVars: {x: '{{ x }}'},
        endpointIds: ['GET /a'],
        baseUrl: 'http://127.0.0.1:1',
        signal: new AbortController().signal,
      });

      await expect(run).to.be.rejectedWith(
        `vars.x contains text that the engine reads as a template ("{{", "$&", "$\`", "$'" or "$$"). Put the value in vars without it, or leave it out.`,
      );
      expect(fs.readdirSync(pkgDir)).to.deepEqual([]);
    } finally {
      fs.rmSync(pkgDir, {recursive: true, force: true});
    }
  });
});
