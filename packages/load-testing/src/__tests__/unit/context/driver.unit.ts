// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {loadDriver} from '../../../context/driver';
import {ConfigError} from '../../../errors';
import {writeFakePackage} from '../../helpers';

describe('loadDriver', () => {
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-'));
  });
  afterEach(() => fs.rmSync(dir, {recursive: true}));

  it('loads the package from the project folder', () => {
    writeFakePackage(dir, 'fake-driver-a', 'module.exports = {answer: 42};');

    expect(loadDriver('fake-driver-a', dir)).to.deepEqual({answer: 42});
  });

  it('throws a ConfigError with the install command when the package is missing', () => {
    expect(() => loadDriver('fake-driver-missing', dir)).to.throw(ConfigError, {
      message: `The "fake-driver-missing" package is not installed in ${dir}. Install it in the project: npm install --save-dev fake-driver-missing`,
    });
  });

  it('does not take the package from the folder of the library', () => {
    // `@loopback/testlab` is installed for the library, and not in `dir`.
    expect(() => loadDriver('@loopback/testlab', dir)).to.throw(ConfigError);
  });

  it('lets the error of a package that fails to load go up', () => {
    writeFakePackage(dir, 'fake-driver-b', "throw new Error('boom');");

    let failure: unknown;
    try {
      loadDriver('fake-driver-b', dir);
    } catch (err) {
      failure = err;
    }

    expect(failure).to.be.instanceOf(Error);
    expect(failure).to.not.be.instanceOf(ConfigError);
    expect((failure as Error).message).to.equal('boom');
  });

  it('does not call a broken install "not installed"', () => {
    writeFakePackage(dir, 'fake-driver-c', "require('fake-inner-missing');");

    let failure: unknown;
    try {
      loadDriver('fake-driver-c', dir);
    } catch (err) {
      failure = err;
    }

    expect(failure).to.not.be.instanceOf(ConfigError);
    expect((failure as Error).message).to.match(/fake-inner-missing/);
  });
});
