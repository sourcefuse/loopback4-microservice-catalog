// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {scenarioOf} from '../../helpers';
import {labelOf, slugOf} from '../../../scenario/label';

describe('labelOf', () => {
  it('puts the describe names before the name', () => {
    const scenario = {
      ...scenarioOf('lists orders', []),
      group: ['OrderController', 'reads'],
    };

    expect(labelOf(scenario)).to.equal(
      'OrderController › reads › lists orders',
    );
  });

  it('is the name for a scenario that no describe holds', () => {
    expect(labelOf(scenarioOf('lists orders', []))).to.equal('lists orders');
  });
});

describe('slugOf', () => {
  it('makes a file name of the label', () => {
    const scenario = {
      ...scenarioOf('links a new customer to a new order!', []),
      group: ['OrderController'],
    };

    expect(slugOf(scenario)).to.equal(
      'ordercontroller-links-a-new-customer-to-a-new-order',
    );
  });

  it('rejects a name with no letter or digit', () => {
    expect(() => slugOf(scenarioOf('!?', []))).to.throw(
      'The scenario name "!?" has no letter or digit',
    );
  });
});
