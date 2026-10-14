// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {scenarioOf} from '../../helpers';
import {load} from '../../../scenario/builder';
import {usesToken} from '../../../scenario/token';
import {captureFrom, template, token} from '../../../scenario/values';
import type {FlowItem, RequestOptions, ScenarioOptions} from '../../../types';

describe('usesToken', () => {
  const withRequest = (options: RequestOptions) =>
    scenarioOf('s', [load.get('/a/{id}', options)]);
  const withFlow = (flow: FlowItem[], options: ScenarioOptions = {}) =>
    scenarioOf('s', flow, options);

  it('is false when no value is a token', () => {
    const scenario = withRequest({
      headers: {authorization: 'Bearer fixed'},
      json: {
        a: [
          captureFrom('GET /x', '$.id'),
          template`a-${captureFrom('GET /x', '$.id')}`,
        ],
      },
    });

    expect(usesToken(scenario)).to.be.false();
  });

  it('finds a token in a body that has a key named constructor', () => {
    const scenario = withRequest({json: {constructor: token()}});

    expect(usesToken(scenario)).to.be.true();
  });

  it('is false for a plain {kind: "token"} object in the data', () => {
    const scenario = withRequest({
      headers: {a: {kind: 'token'} as unknown as string},
      json: {kind: 'token'},
    });

    expect(usesToken(scenario)).to.be.false();
  });

  it('finds token() in a request header, query, path param or json', () => {
    expect(usesToken(withRequest({headers: {a: token()}}))).to.be.true();
    expect(usesToken(withRequest({query: {a: token()}}))).to.be.true();
    expect(usesToken(withRequest({pathParams: {id: token()}}))).to.be.true();
    expect(usesToken(withRequest({json: token()}))).to.be.true();
  });

  it('finds token() deep in a json body', () => {
    expect(
      usesToken(withRequest({json: {a: {b: [{c: token()}]}}})),
    ).to.be.true();
  });

  it('finds token() inside a template, also a nested one', () => {
    const header = template`Bearer ${token()}`;

    expect(
      usesToken(withRequest({headers: {authorization: header}})),
    ).to.be.true();
    expect(
      usesToken(
        withRequest({json: {a: template`x ${template`y ${token()}`}`}}),
      ),
    ).to.be.true();
  });

  it('finds token() in a request inside load.step', () => {
    const scenario = withFlow([
      load.step({
        loop: [load.get('/b', {headers: {a: token()}})],
        count: 2,
      }),
    ]);

    expect(usesToken(scenario)).to.be.true();
  });

  it('finds token() in the headers of the scenario', () => {
    const scenario = withFlow([load.get('/a')], {
      headers: {authorization: template`Bearer ${token()}`},
    });

    expect(usesToken(scenario)).to.be.true();
  });
});
