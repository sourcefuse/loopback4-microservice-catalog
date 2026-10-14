// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {
  captureFrom,
  randomNumber,
  randomString,
  template,
  token,
  uuid,
  vars,
} from '../../../scenario/values';

describe('value constructors', () => {
  it('make objects with a kind', () => {
    expect(vars('a')).to.eql({kind: 'var', name: 'a'});
    expect(captureFrom('GET /a', '$.id')).to.eql({
      kind: 'capture',
      from: 'GET /a',
      jsonPath: '$.id',
    });
    expect(token()).to.eql({kind: 'token'});
    expect(uuid()).to.eql({kind: 'uuid'});
    expect(randomString()).to.eql({kind: 'randomString', length: 8});
    expect(randomString(12)).to.eql({kind: 'randomString', length: 12});
    expect(randomNumber(1, 100)).to.eql({
      kind: 'randomNumber',
      min: 1,
      max: 100,
    });
  });

  it('refuses a length that is not a whole number above 0', () => {
    for (const length of [
      0,
      -1,
      1.5,
      Number.NaN,
      1e21,
      Number.MAX_SAFE_INTEGER + 1,
    ]) {
      expect(() => randomString(length)).to.throw(
        /randomString: the length must be a whole number above 0/,
      );
    }
  });

  it('refuses a minimum above the maximum, and values that are not whole numbers', () => {
    expect(() => randomNumber(5, 1)).to.throw(TypeError, {
      message: /randomNumber: the minimum 5 is above the maximum 1/,
    });
    expect(() => randomNumber(0.5, 2)).to.throw(
      /randomNumber: the minimum and the maximum must be whole numbers/,
    );
  });

  it('refuses a minimum or maximum that Artillery cannot read', () => {
    for (const [min, max] of [
      [-5, 5],
      [0, -1],
      [0, 1e21],
      [1.5, 2],
    ]) {
      expect(() => randomNumber(min, max)).to.throw(
        /randomNumber: the minimum and the maximum must be whole numbers from 0 up/,
      );
    }
    expect(randomNumber(0, 5)).to.eql({kind: 'randomNumber', min: 0, max: 5});
  });

  it('throw a TypeError when they go in a plain string', () => {
    const all = [
      vars('a'),
      captureFrom('GET /a', '$.id'),
      token(),
      uuid(),
      randomString(),
      randomNumber(1, 2),
      template`a`,
    ];
    for (const value of all) {
      expect(() => `${value as unknown as string}`).to.throw(TypeError, {
        message:
          /a value cannot go in a plain string: write template`...\$\{value\}...`/,
      });
    }
  });

  it('throw a TypeError in JSON.stringify, so a JSON filter cannot hold one by mistake', () => {
    for (const value of [uuid(), vars('x'), template`a${uuid()}`]) {
      expect(() => JSON.stringify({where: {name: {neq: value}}})).to.throw(
        TypeError,
        {
          message:
            /a value cannot go in JSON.stringify: build the text with template/,
        },
      );
    }
  });
});

describe('template', () => {
  it('keeps strings, numbers and values in order', () => {
    const id = vars('id');
    expect(template`a-${id}-${7}-${'x'}`).to.eql({
      kind: 'template',
      parts: ['a-', id, '-', '7', '-', 'x'],
    });
  });

  it('has no empty string parts', () => {
    expect(template`${uuid()}`.parts).to.eql([uuid()]);
    expect(template``.parts).to.eql([]);
  });

  it('takes a template inside a template', () => {
    const inner = template`b${randomString(2)}`;
    expect(template`a${inner}`.parts).to.eql(['a', inner]);
  });
});
