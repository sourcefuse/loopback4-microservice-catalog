// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {LocalSignupProvider} from '../../providers';

describe('Local Signup Service', () => {
  let localSignupProvider: LocalSignupProvider;

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('Signup Service', () => {
    it('checks if provider returns a function', async () => {
      const result = localSignupProvider.value();
      expect(result).to.be.Function();
    });
  });

  function setUp() {
    localSignupProvider = new LocalSignupProvider();
  }
});
