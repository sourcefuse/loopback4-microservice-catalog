// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {createMasker} from '../../../../engine/artillery/mask';
import {runCommand} from '../../../../engine/artillery/runner';

const FAKE = 'eyJfake.token.value';
const DUMP = [
  '  User variables:',
  '    target: https://host/calendar-facade',
  `    loadTestsToken: ${FAKE}`,
].join('\n');

describe('createMasker', () => {
  it('hides the token of a failed check and keeps the other variables', () => {
    const mask = createMasker([FAKE]);
    const out = DUMP.split('\n').map(mask).join('\n');

    expect(out).to.not.containEql(FAKE);
    expect(out).to.containEql('loadTestsToken: <masked>');
    expect(out).to.containEql('target: https://host/calendar-facade');
  });

  it('hides a JWT and a Bearer value without the token list', () => {
    const mask = createMasker([]);

    expect(mask('see eyJhbGciOi.eyJzdWIi.sig here')).to.equal(
      'see <masked> here',
    );
    expect(mask('Authorization: Bearer abc.def')).to.equal(
      'Authorization: <masked>',
    );
  });

  it('hides a token that colour codes split', () => {
    const mask = createMasker(['secretvalue123']);

    expect(mask('x \u001b[33msecret\u001b[0mvalue123 y')).to.equal(
      'x <masked> y',
    );
  });

  it('hides the base64 and URL forms of a token', () => {
    const token = 'abc/def+ghi=jkl';
    const mask = createMasker([token]);

    expect(mask(Buffer.from(token).toString('base64'))).to.equal('<masked>');
    expect(mask(encodeURIComponent(token))).to.equal('<masked>');
  });

  it('takes the replacement as text, not as a replace pattern', () => {
    const mask = createMasker(['abcdefgh12345'], {replacement: '$&'});

    expect(mask('x abcdefgh12345 y')).to.equal('x $& y');
  });

  it('hides a Basic header and a pattern without the g flag', () => {
    const mask = createMasker([], {patterns: [/zz\d+/]});

    expect(mask('Basic dXNlcjpwYXNz')).to.equal('Basic <masked>');
    expect(mask('zz1 zz2')).to.equal('<masked> <masked>');
  });

  it('does not hide a short secret', () => {
    expect(createMasker([], {secrets: ['ab']})('ab cd')).to.equal('ab cd');
  });

  it('applies secrets, names, patterns, replacement and custom', () => {
    const mask = createMasker([], {
      secrets: ['hunter2hunter2'],
      names: ['tenantSecret'],
      patterns: [/sk_live_\w+/],
      replacement: '***',
      custom: line => line.replace('mail', 'M'),
    });

    expect(mask('a hunter2hunter2 b')).to.equal('a *** b');
    expect(mask('tenantSecret: zzz')).to.equal('tenantSecret: ***');
    expect(mask('k sk_live_ab12 k')).to.equal('k *** k');
    expect(mask('mail')).to.equal('M');
  });

  it('keeps the built-in rules when custom returns the text unchanged', () => {
    const mask = createMasker([FAKE], {custom: line => line});

    expect(mask(`x ${FAKE}`)).to.not.containEql(FAKE);
  });

  it('hides the whole line when custom throws', () => {
    const mask = createMasker([], {
      custom: () => {
        throw new Error('bad');
      },
    });

    expect(mask('anything')).to.equal('<masked>');
  });
});

describe('runCommand with a mask', () => {
  it('hides a token that arrives in two chunks, on stdout and stderr', async () => {
    const lines: string[] = [];
    const write = (stream: NodeJS.WriteStream) => {
      const original = stream.write;
      stream.write = ((text: string) => {
        lines.push(text);
        return true;
      }) as typeof stream.write;
      return () => (stream.write = original);
    };
    const restoreOut = write(process.stdout);
    const restoreErr = write(process.stderr);
    try {
      const script = `process.stdout.write('loadTestsToken: eyJfake.to');
setTimeout(() => { process.stdout.write('ken.value\\n'); console.error('${FAKE}'); }, 50);`;
      await runCommand(process.execPath, ['-e', script], {
        env: process.env,
        mask: createMasker([FAKE]),
      });
    } finally {
      restoreOut();
      restoreErr();
    }

    const out = lines.join('');
    expect(out).to.not.containEql(FAKE);
    expect(out).to.containEql('loadTestsToken: <masked>');
  });
});
