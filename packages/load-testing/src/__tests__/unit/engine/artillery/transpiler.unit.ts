// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {scenarioOf} from '../../../helpers';
import type {Phase} from '../../../../scenario/types';
import type {LoadRequest, RequestOptions} from '../../../../types';
import {ScenarioError} from '../../../../errors';
import {load} from '../../../../scenario/builder';
import {
  captureFrom,
  randomNumber,
  randomString,
  template,
  token,
  uuid,
  vars,
} from '../../../../scenario/values';
import {
  transpile,
  writeScenario,
} from '../../../../engine/artillery/transpiler';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PHASES: Phase[] = [{duration: 60, arrivalRate: 10}];
const PROCESSOR = '/out/s.processor.js';

describe('transpile', () => {
  describe('plain objects with a kind', () => {
    const plain = [
      {kind: 'uuid', n: 1},
      {kind: 'template', name: 'welcome'},
      {kind: 'token'},
    ];
    const emitted = (options: RequestOptions) =>
      transpile(
        scenarioOf('s', [load.post('/a', options)]),
        undefined,
        PHASES,
        PROCESSOR,
        new Set(),
      ).scenarios[0].flow as Record<string, Record<string, unknown>>[];

    it('go to the script unchanged in json', () => {
      const [flow] = emitted({json: {list: plain}});

      expect(flow.post.json).to.deepEqual({list: plain});
    });

    it('stay as they are in headers and query, as text', () => {
      const {post} = emitted({
        headers: Object.fromEntries(plain.map((p, i) => [`h${i}`, p])) as {},
        query: Object.fromEntries(plain.map((p, i) => [`q${i}`, p])) as {},
      })[0];

      expect(post.headers).to.deepEqual({
        h0: '[object Object]',
        h1: '[object Object]',
        h2: '[object Object]',
      });
      expect(post.qs).to.deepEqual({
        q0: '[object Object]',
        q1: '[object Object]',
        q2: '[object Object]',
      });
    });

    it('do not replace a plain request object inside a load.step', () => {
      // A literal is user data, so the type is wrong on purpose.
      const literal = {
        kind: 'request',
        id: 'GET /x',
        path: '/x',
      } as unknown as LoadRequest;
      const step = load.step({loop: [literal], count: 1});
      const flow = transpile(
        scenarioOf('s', [step]),
        undefined,
        PHASES,
        PROCESSOR,
        new Set(),
      ).scenarios[0].flow;

      expect(flow).to.deepEqual([{loop: [literal], count: 1}]);
    });
  });

  describe('headers and the token', () => {
    const BEARER = 'Bearer {{ $env.LOAD_TESTS_TOKEN }}';
    const flowOf = (scenario: ReturnType<typeof scenarioOf>) =>
      transpile(scenario, undefined, PHASES, PROCESSOR, new Set()).scenarios[0]
        .flow as Record<string, Record<string, unknown>>[];

    it('adds no authorization header by itself', () => {
      const [flow] = flowOf(scenarioOf('s', [load.get('/a')]));

      expect(flow.get).to.not.have.property('headers');
    });

    it('renders token() in a template of a request header', () => {
      const [flow] = flowOf(
        scenarioOf('s', [
          load.get('/a', {
            headers: {authorization: template`Bearer ${token()}`},
          }),
        ]),
      );

      expect(flow.get.headers).to.deepEqual({authorization: BEARER});
    });

    it('puts the headers of the scenario on every request, also in a nested step, and renders values', () => {
      const flow = flowOf(
        scenarioOf(
          's',
          [load.get('/a'), load.step({loop: [load.get('/b')], count: 1})],
          {headers: {authorization: template`Bearer ${token()}`}},
        ),
      );

      expect(flow[0].get.headers).to.deepEqual({authorization: BEARER});
      const nested = flow[1].loop as unknown as typeof flow;
      expect(nested[0].get.headers).to.deepEqual({authorization: BEARER});
    });

    it('lets a request header beat a scenario header with another spelling of the name', () => {
      const [flow] = flowOf(
        scenarioOf('s', [load.get('/a', {headers: {authorization: 'own'}})], {
          headers: {Authorization: template`Bearer ${token()}`, 'X-A': '1'},
        }),
      );

      expect(flow.get.headers).to.deepEqual({'X-A': '1', authorization: 'own'});
    });
  });

  it('writes one named step per request and wires captures', () => {
    const scenario = scenarioOf('order-item-read', [
      load.get('/order-items', {query: {limit: 20}}),
      load.get('/order-items/count', {p95: 500}),
      load.get('/order-items/{id}', {
        pathParams: {id: captureFrom('GET /order-items', '$[0].id')},
      }),
    ]);

    expect(
      transpile(scenario, undefined, PHASES, PROCESSOR, new Set()),
    ).to.deepEqual({
      config: {
        target: '{{ $env.LOAD_TESTS_BASE_URL }}',
        phases: [{duration: 60, arrivalRate: 10}],
        plugins: {'metrics-by-endpoint': {useOnlyRequestNames: true}},
        processor: PROCESSOR,
      },
      scenarios: [
        {
          name: 'order-item-read',
          flow: [
            {
              get: {
                url: '/order-items',
                name: 'GET /order-items',
                qs: {limit: '20'},
                capture: [{json: '$[0].id', as: 'loadTestsCapture_0'}],
                afterResponse: ['loadTestsCaptures_0'],
              },
            },
            {
              get: {
                url: '/order-items/count',
                name: 'GET /order-items/count',
              },
            },
            {
              get: {
                url: '/order-items/{{ loadTestsCapture_0 }}',
                name: 'GET /order-items/{id}',
              },
            },
          ],
        },
      ],
    });
  });

  it('puts the check of the captured values first in afterResponse, before the hook of the user and the raw ones', () => {
    const scenario = scenarioOf('checked', [
      load.get('/orders', {
        afterResponse: () => undefined,
        artillery: {raw: {afterResponse: 'mine'}},
      }),
      load.get('/orders/{id}', {
        pathParams: {id: captureFrom('GET /orders', '$.id')},
      }),
    ]);

    const script = transpile(scenario, undefined, PHASES, PROCESSOR, new Set());

    const flow = script.scenarios[0].flow as Array<{
      get: {afterResponse?: string[]};
    }>;
    expect(flow[0].get.afterResponse).to.deepEqual([
      'loadTestsCaptures_0',
      'afterResponse_0',
      'mine',
    ]);
    expect(flow[1].get.afterResponse).to.be.undefined();
    expect(script.config.processor).to.equal(PROCESSOR);
  });

  it('sets a processor for a request that captures, also with no other hook', () => {
    const scenario = scenarioOf('captures only', [
      load.get('/orders'),
      load.get('/orders/{id}', {
        pathParams: {id: captureFrom('GET /orders', '$.id')},
      }),
    ]);

    const script = transpile(scenario, undefined, PHASES, PROCESSOR, new Set());

    expect(script.config.processor).to.equal(PROCESSOR);
  });

  it('encodes a literal path param', () => {
    const scenario = scenarioOf('encode', [
      load.get('/orders/{id}', {pathParams: {id: 'a/b c'}}),
    ]);

    const flow = transpile(scenario, undefined, PHASES, PROCESSOR, new Set())
      .scenarios[0].flow as Array<{get: {url: string}}>;

    expect(flow[0].get.url).to.equal('/orders/a%2Fb%20c');
  });

  it('fills a path param whose name has a dash', () => {
    const scenario = scenarioOf('dash', [
      load.get('/orders/{order-id}', {pathParams: {'order-id': 'o1'}}),
    ]);

    const flow = transpile(scenario, undefined, PHASES, PROCESSOR, new Set())
      .scenarios[0].flow as Array<{get: {url: string}}>;

    expect(flow[0].get.url).to.equal('/orders/o1');
  });

  it('puts literal path params and the body in place', () => {
    const scenario = scenarioOf('write', [
      load.delete('/orders/{orderId}', {
        pathParams: {orderId: 'd1'},
        json: {reason: 'x'},
      }),
    ]);

    expect(
      transpile(scenario, undefined, PHASES, PROCESSOR, new Set()).scenarios[0]
        .flow,
    ).to.deepEqual([
      {
        delete: {
          url: '/orders/d1',
          name: 'DELETE /orders/{orderId}',
          json: {reason: 'x'},
        },
      },
    ]);
  });

  it('rejects a capture from a request that is not in the scenario', () => {
    const scenario = scenarioOf('s', [
      load.get('/a/{id}', {pathParams: {id: captureFrom('GET /b', '$.id')}}),
    ]);

    expect(() =>
      transpile(scenario, undefined, PHASES, PROCESSOR, new Set()),
    ).to.throw({
      name: 'ScenarioError',
      message: /GET \/a\/\{id\}: capture source "GET \/b" is not a request/,
    });
  });

  it('rejects a capture from a request that comes later', () => {
    const scenario = scenarioOf('s', [
      load.get('/a/{id}', {pathParams: {id: captureFrom('GET /b', '$.id')}}),
      load.get('/b'),
    ]);

    expect(() =>
      transpile(scenario, undefined, PHASES, PROCESSOR, new Set()),
    ).to.throw(/capture source "GET \/b" is not earlier in the flow/);
  });

  it('rejects a path param with no value', () => {
    const scenario = scenarioOf('s', [load.get('/a/{id}')]);

    expect(() =>
      transpile(scenario, undefined, PHASES, PROCESSOR, new Set()),
    ).to.throw(/GET \/a\/\{id\}: no value for \{id\}/);
  });

  describe('captureFrom inside json bodies', () => {
    it('captures an earlier request into a nested body field', () => {
      const scenario = scenarioOf('s', [
        load.get('/a'),
        load.post('/b', {
          json: {parent: {id: captureFrom('GET /a', '$.id')}},
        }),
      ]);

      const flow = transpile(scenario, undefined, PHASES, PROCESSOR, new Set())
        .scenarios[0].flow;

      expect(flow[0]).to.deepEqual({
        get: {
          url: '/a',
          name: 'GET /a',
          capture: [{json: '$.id', as: 'loadTestsCapture_0'}],
          afterResponse: ['loadTestsCaptures_0'],
        },
      });
      expect(flow[1]).to.deepEqual({
        post: {
          url: '/b',
          name: 'POST /b',
          json: {parent: {id: '{{ loadTestsCapture_0 }}'}},
        },
      });
    });

    it('captures inside an array element of the body, and keeps a literal as is', () => {
      const scenario = scenarioOf('s', [
        load.get('/a'),
        load.post('/b', {
          json: {ids: [captureFrom('GET /a', '$.id'), 'literal']},
        }),
      ]);

      const post = transpile(scenario, undefined, PHASES, PROCESSOR, new Set())
        .scenarios[0].flow[1] as unknown as {
        post: {json: unknown};
      };

      expect(post.post.json).to.deepEqual({
        ids: ['{{ loadTestsCapture_0 }}', 'literal'],
      });
    });

    it('gives each capture a variable of its own, also when the body keys look the same', () => {
      const scenario = scenarioOf('s', [
        load.get('/a'),
        load.post('/b', {
          json: {
            'client.id': captureFrom('GET /a', '$.first'),
            'client-id': captureFrom('GET /a', '$.second'),
            'client id': captureFrom('GET /a', '$.third'),
            client: {id: captureFrom('GET /a', '$.fourth')},
          },
        }),
      ]);

      const flow = transpile(scenario, undefined, PHASES, PROCESSOR, new Set())
        .scenarios[0].flow as unknown as Array<{
        get?: {capture: Array<{json: string; as: string}>};
        post?: {json: unknown};
      }>;

      expect(flow[1].post?.json).to.deepEqual({
        'client.id': '{{ loadTestsCapture_0 }}',
        'client-id': '{{ loadTestsCapture_1 }}',
        'client id': '{{ loadTestsCapture_2 }}',
        client: {id: '{{ loadTestsCapture_3 }}'},
      });
      expect(flow[0].get?.capture).to.deepEqual([
        {json: '$.first', as: 'loadTestsCapture_0'},
        {json: '$.second', as: 'loadTestsCapture_1'},
        {json: '$.third', as: 'loadTestsCapture_2'},
        {json: '$.fourth', as: 'loadTestsCapture_3'},
      ]);
    });

    it('rejects a request that is in the flow twice', () => {
      const list = load.get('/a');

      expect(() =>
        transpile(
          scenarioOf('s', [list, load.get('/b'), list]),
          undefined,
          PHASES,
          PROCESSOR,
          new Set(),
        ),
      ).to.throw(/a request is in the flow twice/);
    });

    it('rejects a body capture from a request that comes later', () => {
      const scenario = scenarioOf('s', [
        load.post('/a', {json: {id: captureFrom('GET /b', '$.id')}}),
        load.get('/b'),
      ]);

      expect(() =>
        transpile(scenario, undefined, PHASES, PROCESSOR, new Set()),
      ).to.throw(/capture source "GET \/b" is not earlier in the flow/);
    });
  });

  describe('parallel', () => {
    const flowOf = (scenario: ReturnType<typeof scenarioOf>) =>
      transpile(scenario, undefined, PHASES, PROCESSOR, new Set()).scenarios[0]
        .flow;

    it('writes a parallel step with the names, headers and captures of its requests, and a capture after it works', () => {
      const scenario = scenarioOf('s', [
        load.parallel(
          [
            load.get('/orders', {headers: {'x-a': '1'}}),
            load.get('/products', {query: {q: 'x'}}),
          ],
          {limit: 2},
        ),
        load.get('/orders/{id}', {
          pathParams: {id: captureFrom('GET /orders', '$[0].id')},
        }),
      ]);

      expect(flowOf(scenario)).to.deepEqual([
        {
          parallel: [
            {
              get: {
                url: '/orders',
                name: 'GET /orders',
                headers: {'x-a': '1'},
                capture: [{json: '$[0].id', as: 'loadTestsCapture_0'}],
                afterResponse: ['loadTestsCaptures_0'],
              },
            },
            {
              get: {
                url: '/products',
                name: 'GET /products',
                qs: {q: 'x'},
              },
            },
          ],
          limit: 2,
        },
        {
          get: {
            url: '/orders/{{ loadTestsCapture_0 }}',
            name: 'GET /orders/{id}',
          },
        },
      ]);
    });

    it('leaves out limit when the group has none', () => {
      const [group] = flowOf(
        scenarioOf('s', [load.parallel([load.get('/a')])]),
      );

      expect(group).to.not.have.property('limit');
    });

    it('rejects a capture from a request of the same group', () => {
      const scenario = scenarioOf('s', [
        load.parallel([
          load.get('/a'),
          load.get('/b/{id}', {
            pathParams: {id: captureFrom('GET /a', '$.id')},
          }),
        ]),
      ]);

      expect(() => flowOf(scenario)).to.throw(ScenarioError, {
        message:
          /GET \/b\/\{id\}: capture source "GET \/a" runs in parallel with this request/,
      });
    });

    it('rejects a capture from a later request of the same group', () => {
      const scenario = scenarioOf('s', [
        load.parallel([
          load.get('/b/{id}', {
            pathParams: {id: captureFrom('GET /a', '$.id')},
          }),
          load.get('/a'),
        ]),
      ]);

      expect(() => flowOf(scenario)).to.throw(
        /capture source "GET \/a" runs in parallel with this request/,
      );
    });

    it('takes a capture from an earlier request, also when a request of the group has the same id', () => {
      const scenario = scenarioOf('s', [
        load.get('/a'),
        load.parallel([
          load.get('/b/{id}', {
            pathParams: {id: captureFrom('GET /a', '$.id')},
          }),
          load.get('/a'),
        ]),
      ]);

      expect(flowOf(scenario)).to.deepEqual([
        {
          get: {
            url: '/a',
            name: 'GET /a',
            capture: [{json: '$.id', as: 'loadTestsCapture_0'}],
            afterResponse: ['loadTestsCaptures_0'],
          },
        },
        {
          parallel: [
            {get: {url: '/b/{{ loadTestsCapture_0 }}', name: 'GET /b/{id}'}},
            {get: {url: '/a', name: 'GET /a'}},
          ],
        },
      ]);
    });

    it('says "not earlier" for a request of a group that captures from itself', () => {
      const scenario = scenarioOf('s', [
        load.parallel([
          load.get('/b/{id}', {
            pathParams: {id: captureFrom('GET /b/{id}', '$.id')},
          }),
          load.get('/c'),
        ]),
      ]);

      expect(() => flowOf(scenario)).to.throw(
        /capture source "GET \/b\/\{id\}" is not earlier in the flow/,
      );
    });

    it('transpiles a group inside a loop', () => {
      const scenario = scenarioOf('s', [
        load.step({
          loop: [load.parallel([load.get('/a'), load.get('/b')])],
          count: 2,
        }),
      ]);

      expect(flowOf(scenario)).to.deepEqual([
        {
          loop: [
            {
              parallel: [
                {get: {url: '/a', name: 'GET /a'}},
                {get: {url: '/b', name: 'GET /b'}},
              ],
            },
          ],
          count: 2,
        },
      ]);
    });

    it('rejects the same request twice in a group', () => {
      const a = load.get('/a');

      expect(() => flowOf(scenarioOf('s', [load.parallel([a, a])]))).to.throw(
        /a request is in the flow twice/,
      );
    });
  });

  describe('vars', () => {
    it('puts vars in path params and bodies, and sets up a processor', () => {
      const scenario = scenarioOf('s', [
        load.patch('/order-items/{id}', {
          pathParams: {id: vars('orderItemId')},
          json: {orderId: vars('orderId'), quantity: 6},
        }),
      ]);

      const script = transpile(
        scenario,
        undefined,
        PHASES,
        '/out/s.processor.js',
        new Set(['orderItemId', 'orderId']),
      );

      expect(script.config.processor).to.equal('/out/s.processor.js');
      expect(script.scenarios[0].beforeScenario).to.deepEqual([
        'loadTestsBeforeScenario',
      ]);
      expect(script.scenarios[0].flow[0]).to.deepEqual({
        patch: {
          url: '/order-items/{{ orderItemId }}',
          name: 'PATCH /order-items/{id}',
          json: {orderId: '{{ orderId }}', quantity: 6},
        },
      });
    });

    it('rejects a name that no hook sets', () => {
      const scenario = scenarioOf('s', [
        load.get('/a/{id}', {pathParams: {id: vars('missing')}}),
      ]);

      expect(() =>
        transpile(scenario, undefined, PHASES, PROCESSOR, new Set()),
      ).to.throw(
        /GET \/a\/\{id\}: vars\("missing"\) is set by neither before nor beforeEach/,
      );
    });

    it('needs no processor when nothing uses hooks or vars', () => {
      const script = transpile(
        scenarioOf('s', [load.get('/a')]),
        undefined,
        PHASES,
        PROCESSOR,
        new Set(),
      );

      expect(script.config).to.not.have.property('processor');
      expect(script.scenarios[0]).to.not.have.property('beforeScenario');
    });
  });

  describe('values', () => {
    const run = (
      requests: Parameters<typeof scenarioOf>[1],
      known: string[] = [],
    ) =>
      transpile(
        scenarioOf('s', requests),
        undefined,
        PHASES,
        PROCESSOR,
        new Set(known),
      ).scenarios[0].flow as Record<string, Record<string, unknown>>[];

    it('renders every kind in json, deep and in an array', () => {
      const [flow] = run(
        [
          load.post('/a', {
            json: {
              token: token(),
              deep: {name: template`order-${randomString(4)}`},
              list: [uuid(), randomNumber(1, 9), vars('v'), 'plain', 5],
              when: new Date(0),
            },
          }),
        ],
        ['v'],
      );

      expect(flow.post.json).to.deepEqual({
        token: '{{ $env.LOAD_TESTS_TOKEN }}',
        deep: {name: 'order-{{ $randomString(4) }}'},
        list: [
          '{{ $uuid }}',
          '{{ $randomNumber(1, 9) }}',
          '{{ v }}',
          'plain',
          5,
        ],
        when: new Date(0),
      });
    });

    it('renders values in pathParams, headers and query, and query is emitted as qs', () => {
      const [flow] = run([
        load.get('/a/{id}/{n}', {
          pathParams: {id: uuid(), n: 3},
          headers: {
            authorization: template`Bearer ${token()}`,
            'x-r': randomString(),
          },
          query: {
            limit: 20,
            all: true,
            name: template`a-${randomNumber(1, 2)}`,
            id: uuid(),
          },
        }),
      ]);

      expect(flow.get).to.containDeep({
        url: '/a/{{ $uuid }}/3',
        headers: {
          authorization: 'Bearer {{ $env.LOAD_TESTS_TOKEN }}',
          'x-r': '{{ $randomString(8) }}',
        },
        qs: {
          limit: '20',
          all: 'true',
          name: 'a-{{ $randomNumber(1, 2) }}',
          id: '{{ $uuid }}',
        },
      });
      expect(flow.get).to.not.have.property('query');
    });

    it('renders a capture inside a template inside query, and adds it to the source', () => {
      const [first, second] = run([
        load.post('/orders'),
        load.get('/search', {
          query: {
            where: template`{"orderId":"${captureFrom('POST /orders', '$.id')}"}`,
          },
          headers: {'x-order': captureFrom('POST /orders', '$.ref')},
        }),
      ]);

      expect(first.post.capture).to.deepEqual([
        {json: '$.ref', as: 'loadTestsCapture_0'},
        {json: '$.id', as: 'loadTestsCapture_1'},
      ]);
      expect(second.get).to.containDeep({
        qs: {where: '{"orderId":"{{ loadTestsCapture_1 }}"}'},
        headers: {'x-order': '{{ loadTestsCapture_0 }}'},
      });
    });

    it('resolves a var under a json key named constructor, and does not send it as a leaf', () => {
      const [flow] = run(
        [load.post('/a', {json: {constructor: vars('id')}})],
        ['id'],
      );

      expect(flow.post.json).to.deepEqual({constructor: '{{ id }}'});
    });

    it('renders a capture in a json body made with Object.create(null)', () => {
      const body = Object.assign(Object.create(null), {
        ref: captureFrom('POST /orders', '$.id'),
      });

      const [first, second] = run([
        load.post('/orders'),
        load.post('/b', {json: body}),
      ]);

      expect(first.post.capture).to.deepEqual([
        {json: '$.id', as: 'loadTestsCapture_0'},
      ]);
      expect(second.post.json).to.deepEqual({ref: '{{ loadTestsCapture_0 }}'});
    });

    it('renders a nested template', () => {
      const [flow] = run([
        load.get('/a', {query: {q: template`a${template`b${uuid()}c`}d`}}),
      ]);

      expect(flow.get.qs).to.deepEqual({q: 'ab{{ $uuid }}cd'});
    });

    it('rejects a var that no hook sets, inside a template', () => {
      expect(() =>
        run([load.get('/a', {query: {q: template`x-${vars('missing')}`}})]),
      ).to.throw(
        /GET \/a: vars\("missing"\) is set by neither before nor beforeEach/,
      );
    });
  });

  describe('escape hatches', () => {
    it('deep-merges the artillery config of the scenario into the emitted config', () => {
      const scenario = scenarioOf('s', [load.get('/a')], {
        artillery: {config: {http: {timeout: 30}, plugins: {expect: {}}}},
      });

      expect(
        transpile(scenario, undefined, PHASES, PROCESSOR, new Set()).config,
      ).to.deepEqual({
        target: '{{ $env.LOAD_TESTS_BASE_URL }}',
        phases: PHASES,
        plugins: {
          'metrics-by-endpoint': {useOnlyRequestNames: true},
          expect: {},
        },
        http: {timeout: 30},
      });
    });

    it('rejects artillery.config.processor, because the library owns the processor', () => {
      const scenario = scenarioOf('s', [load.get('/a')], {
        artillery: {config: {processor: './mine.js'}},
      });

      expect(() =>
        transpile(scenario, undefined, PHASES, PROCESSOR, new Set()),
      ).to.throw(
        /artillery.config.processor is not allowed: use artillery.processor/,
      );
    });

    it('rejects artillery.config.phases, because phases is the load', () => {
      const scenario = scenarioOf('s', [load.get('/a')], {
        artillery: {config: {phases: [{duration: 1, arrivalRate: 1}]}},
      });

      expect(() =>
        transpile(scenario, undefined, PHASES, PROCESSOR, new Set()),
      ).to.throw(ScenarioError, {
        message: /artillery.config.phases is not allowed: use phases/,
      });
    });

    it('spreads raw into a request and adds its capture to the captures of the library', () => {
      const scenario = scenarioOf('s', [
        load.get('/a', {
          artillery: {
            raw: {
              ifTrue: 'go',
              expect: [{statusCode: 200}],
              capture: {header: 'content-type', as: 'ct'},
            },
          },
        }),
        load.get('/b/{id}', {
          pathParams: {id: captureFrom('GET /a', '$.id')},
        }),
      ]);

      expect(
        transpile(scenario, undefined, PHASES, PROCESSOR, new Set())
          .scenarios[0].flow[0],
      ).to.deepEqual({
        get: {
          url: '/a',
          name: 'GET /a',
          ifTrue: 'go',
          expect: [{statusCode: 200}],
          capture: [
            {json: '$.id', as: 'loadTestsCapture_0'},
            {header: 'content-type', as: 'ct'},
          ],
          afterResponse: ['loadTestsCaptures_0'],
        },
      });
    });

    it('passes raw steps on, and transpiles the requests inside loop and parallel', () => {
      const scenario = scenarioOf('s', [
        load.step({think: 0.2}),
        load.step({loop: [load.get('/a'), load.step({log: 'x'})], count: 2}),
        load.parallel([load.get('/b'), load.get('/c')], {limit: 1}),
      ]);

      const get = (url: string) => ({
        get: {url, name: `GET ${url}`},
      });
      expect(
        transpile(scenario, undefined, PHASES, PROCESSOR, new Set())
          .scenarios[0].flow,
      ).to.deepEqual([
        {think: 0.2},
        {loop: [get('/a'), {log: 'x'}], count: 2},
        {parallel: [get('/b'), get('/c')], limit: 1},
      ]);
    });

    it('adds the raw hooks of a scenario to the hooks of the library, and keeps its other fields', () => {
      const scenario = scenarioOf('s', [load.get('/a')], {
        beforeEach: () => ({}),
        artillery: {
          raw: {weight: 3, onError: 'handle', beforeScenario: 'mine'},
        },
      });

      const emitted = transpile(
        scenario,
        undefined,
        PHASES,
        PROCESSOR,
        new Set(),
      ).scenarios[0];

      expect(emitted).to.containEql({weight: 3, onError: 'handle'});
      expect(emitted.beforeScenario).to.deepEqual([
        'loadTestsBeforeScenario',
        'mine',
      ]);
    });

    it('adds the raw hooks of a request to the hooks of the library', () => {
      const scenario = scenarioOf('s', [
        load.get('/a', {
          beforeRequest: () => undefined,
          artillery: {
            raw: {beforeRequest: 'mine', afterResponse: ['one', 'two']},
          },
        }),
      ]);

      const emitted = transpile(
        scenario,
        undefined,
        PHASES,
        PROCESSOR,
        new Set(),
      ).scenarios[0].flow[0] as {
        get: {beforeRequest: string[]; afterResponse: string[]};
      };

      expect(emitted.get.beforeRequest).to.deepEqual([
        'beforeRequest_0',
        'mine',
      ]);
      expect(emitted.get.afterResponse).to.deepEqual(['one', 'two']);
    });
  });
});

describe('writeScenario', () => {
  const pkgDir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-'));
  after(() => fs.rmSync(pkgDir, {recursive: true}));

  it('writes the script and the processor', () => {
    const scenario = scenarioOf('s', [load.get('/a')], {
      beforeEach: ({vu}) => ({vu}),
    });

    const scriptPath = writeScenario(pkgDir, scenario, undefined, PHASES, {});

    expect(scriptPath).to.equal(
      path.join(pkgDir, 'src/__tests__/load/.out/s.json'),
    );
    expect(
      fs.existsSync(scriptPath.replace('.json', '.processor.js')),
    ).to.be.true();
  });

  it('names the files of a scenario after its group and its sentence', () => {
    const scenario = {
      ...scenarioOf('links a new order!', [load.get('/a')], {
        beforeEach: ({vu}) => ({vu}),
      }),
      group: ['OrderController'],
    };

    const scriptPath = writeScenario(pkgDir, scenario, undefined, PHASES, {});

    expect(path.basename(scriptPath)).to.equal(
      'ordercontroller-links-a-new-order.json',
    );
  });

  it('writes the phases that it gets into the script', () => {
    const scenario = scenarioOf('named phases', [load.get('/a')]);
    const phases: Phase[] = [
      {name: 'warm up', pause: 5},
      {duration: 10, arrivalRate: 2},
    ];

    const scriptPath = writeScenario(pkgDir, scenario, undefined, phases, {});

    expect(
      JSON.parse(fs.readFileSync(scriptPath, 'utf8')).config.phases,
    ).to.deepEqual(phases);
  });

  it('does not let a trial of a hook add to the vars of the run', () => {
    const runVars = {};
    const scenario = scenarioOf('trial vars', [
      load.get('/a', {
        beforeRequest: (_req, ctx) => {
          ctx.vars.counter = 1;
        },
      }),
    ]);

    const scriptPath = writeScenario(
      pkgDir,
      scenario,
      undefined,
      PHASES,
      runVars,
    );

    expect(runVars).to.deepEqual({});
    expect(
      fs.readFileSync(scriptPath.replace('.json', '.processor.js'), 'utf8'),
    ).to.match(/^const loadTestsRunVars = \(\) => \(\{\}\);$/m);
  });

  it('gives the hooks of a method that is async, a method, and an arrow', () => {
    const scenario = scenarioOf(
      'forms',
      [
        load.get('/a', {
          beforeRequest(req) {
            req.url = 'x';
          },
          afterResponse: (_req, res) => res.statusCode,
        }),
      ],
      {
        beforeEach({vu}) {
          return {vu};
        },
      },
    );

    expect(() =>
      writeScenario(pkgDir, scenario, undefined, PHASES, {}),
    ).to.not.throw();
    const source = fs.readFileSync(
      path.join(pkgDir, 'src/__tests__/load/.out/forms.processor.js'),
      'utf8',
    );
    expect(source).to.match(/const loadTestsBeforeEach = \(\{beforeEach\(/);
    expect(source).to.match(
      /const loadTestsBeforeRequest_0 = \(\{beforeRequest\(/,
    );
    expect(source).to.match(
      /const loadTestsAfterResponse_0 = \(_req, res\) =>/,
    );
  });

  it('does not count a var that only a request hook sets', () => {
    const scenario = scenarioOf('hook var', [
      load.get('/a', {
        beforeRequest: (_req, ctx) => {
          ctx.vars.token = 'x';
        },
      }),
      load.get('/b/{id}', {pathParams: {id: vars('token')}}),
    ]);

    expect(() =>
      writeScenario(pkgDir, scenario, undefined, PHASES, {}),
    ).to.throw(/vars\("token"\) is set by neither before nor beforeEach/);
  });

  it('accepts a hook written as a method', () => {
    const method = scenarioOf('m', [load.get('/a')], {
      beforeEach({vu}) {
        return {vu};
      },
    });

    expect(() =>
      writeScenario(pkgDir, method, undefined, PHASES, {}),
    ).to.not.throw();
  });

  it('rejects a name that a function and the processor both use', () => {
    const mine = path.join(pkgDir, 'dup.js');
    fs.writeFileSync(mine, `exports.same = () => undefined;`);
    const scenario = scenarioOf('dup', [load.get('/a')], {
      artillery: {functions: {same: () => undefined}, processor: mine},
    });

    expect(() =>
      writeScenario(pkgDir, scenario, undefined, PHASES, {}),
    ).to.throw(/the function names same are used twice or are reserved/);
  });

  it('rejects the name of a generated function', () => {
    const scenario = scenarioOf('res', [load.get('/a')], {
      artillery: {functions: {loadTestsBeforeScenario: () => undefined}},
    });

    expect(() =>
      writeScenario(pkgDir, scenario, undefined, PHASES, {}),
    ).to.throw(/loadTestsBeforeScenario are used twice or are reserved/);
  });
});

describe('transpile with the config of Artillery', () => {
  it('uses exactly the phases that it gets, also a ramp and a pause', () => {
    const phases: Phase[] = [
      {duration: 5, arrivalRate: 1, rampTo: 3},
      {pause: 2},
    ];
    const scenario = scenarioOf('s', [load.get('/a')]);

    expect(
      transpile(scenario, undefined, phases, PROCESSOR, new Set()).config
        .phases,
    ).to.deepEqual(phases);
  });

  it('merges the config of the package first and the one of the scenario second', () => {
    const defaults = {http: {timeout: 30, maxSockets: 5}};
    const scenario = scenarioOf('s', [load.get('/a')], {
      artillery: {config: {http: {timeout: 60}}},
    });

    const {config} = transpile(
      scenario,
      defaults,
      PHASES,
      PROCESSOR,
      new Set(),
    );

    expect(config).to.containDeep({
      phases: PHASES,
      http: {timeout: 60, maxSockets: 5},
    });
  });

  it('uses the config of the package when the scenario has none', () => {
    const scenario = scenarioOf('s', [load.get('/a')]);

    const {config} = transpile(
      scenario,
      {http: {timeout: 30}},
      PHASES,
      PROCESSOR,
      new Set(),
    );

    expect(config).to.containDeep({http: {timeout: 30}});
  });
});
