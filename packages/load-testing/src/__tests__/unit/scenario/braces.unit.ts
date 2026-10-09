// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {bracesProblems} from '../../../scenario/braces';
import {load} from '../../../scenario/builder';
import {randomString, template} from '../../../scenario/values';

describe('bracesProblems', () => {
  it('finds a "{{" string in each of the four fields and in the path', () => {
    const req = load.post('/a/{{ x }}/{id}', {
      pathParams: {id: '{{ y }}'},
      headers: {h: '{{ z }}'},
      query: {q: 'a{{ w }}'},
      json: {name: '{{ n }}'},
    });

    expect(bracesProblems(req)).to.deepEqual([
      'POST /a/{{ x }}/{id}: path contains "{{": use template`...`',
      'POST /a/{{ x }}/{id}: pathParams.id contains "{{": use template`...`',
      'POST /a/{{ x }}/{id}: headers.h contains "{{": use template`...`',
      'POST /a/{{ x }}/{id}: query.q contains "{{": use template`...`',
      'POST /a/{{ x }}/{id}: json.name contains "{{": use template`...`',
    ]);
  });

  it('finds a deep json string, also in an array', () => {
    const req = load.post('/orders', {
      json: {a: {b: [1, {c: '{{ x }}'}]}},
    });

    expect(bracesProblems(req)).to.deepEqual([
      'POST /orders: json.a.b[1].c contains "{{": use template`...`',
    ]);
  });

  it('finds a "{{" in a string piece of a template, also a nested one', () => {
    const req = load.get('/a', {
      query: {
        q: template`{{ x }}`,
        r: template`a${template`${randomString()}{{`}`,
      },
    });

    expect(bracesProblems(req)).to.deepEqual([
      'GET /a: query.q contains "{{": use template`...`',
      'GET /a: query.r contains "{{": use template`...`',
    ]);
  });

  it('checks a json body that has a key named constructor', () => {
    const req = load.post('/x', {json: {constructor: 'a{{b}}'}});

    expect(bracesProblems(req)).to.deepEqual([
      'POST /x: json.constructor contains "{{": use template`...`',
    ]);
  });

  it('checks an object that has no prototype', () => {
    const body = Object.assign(Object.create(null), {name: '{{ n }}'});
    const req = load.post('/x', {json: {inner: body}});

    expect(bracesProblems(req)).to.deepEqual([
      'POST /x: json.inner.name contains "{{": use template`...`',
    ]);
  });

  it('finds a "{{" in a key of json, headers, query and pathParams', () => {
    const req = load.post('/orders/{id}', {
      pathParams: {'{{ p }}': 1},
      headers: {'{{ h }}': 'a'},
      query: {'{{ q }}': 'a'},
      json: {'{{ x }}': 1, deep: [{'a{{': 2}]},
    });

    expect(bracesProblems(req)).to.deepEqual([
      'POST /orders/{id}: pathParams key "{{ p }}" contains "{{": rename the key',
      'POST /orders/{id}: headers key "{{ h }}" contains "{{": rename the key',
      'POST /orders/{id}: query key "{{ q }}" contains "{{": rename the key',
      'POST /orders/{id}: json key "{{ x }}" contains "{{": rename the key',
      'POST /orders/{id}: json.deep[0] key "a{{" contains "{{": rename the key',
    ]);
  });

  it('accepts single braces, values, and the strings under artillery', () => {
    const req = load.post('/a/{id}', {
      pathParams: {id: 1},
      json: {a: '{x}', b: randomString(), when: new Date()},
      artillery: {raw: {headers: {x: '{{ $env.X }}'}} as never},
    });

    expect(bracesProblems(req)).to.deepEqual([]);
  });
});
