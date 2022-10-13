// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {OtpGenerateProvider} from '../../providers/otp-generate.provider';

describe('OTP Generate Provider', () => {
  let otpGenerateProvider: OtpGenerateProvider;
  const logger = {
    log,
    info,
    warn,
    error,
    debug,
  };

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('otp generate provider', () => {
    it('checks if provider returns a function', async () => {
      const result = otpGenerateProvider.value();
      expect(result).to.be.Function();
    });

    it('checks if provider is generating otp', async () => {
      const secret = 'i6im0gc96j0mn00c';
      const func = otpGenerateProvider.value();
      const result = await func(secret);
      expect(result).to.be.String();
    });
  });

  function log() {
    // This is intentional
  }

  function info() {
    // This is intentional
  }

  function warn() {
    // This is intentional
  }

  function error() {
    // This is intentional
  }

  function debug() {
    // This is intentional
  }

  function setUp() {
    otpGenerateProvider = new OtpGenerateProvider(logger);
  }
});
