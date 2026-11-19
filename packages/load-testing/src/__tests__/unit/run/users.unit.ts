// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {readUsers} from '../../../run/users';
import {usersFileOf} from '../../helpers';

const PASSWORD = 'secret-password-1';
const ok = {username: 'ann', password: PASSWORD};

describe('readUsers', () => {
  it('reads a list of users', () => {
    expect(readUsers(usersFileOf([ok]))).to.deepEqual([ok]);
  });

  const bad: Array<[string, unknown, RegExp]> = [
    [
      'is not JSON',
      `[{"username":"ann","password":"${PASSWORD}"`,
      /is not JSON/,
    ],
    ['is an object', {username: 'ann'}, /at least one user/],
    ['is empty', [], /at least one user/],
    ['has an entry that is a string', ['ann'], /entry 0 must be an object/],
    ['has an entry that is null', [null], /entry 0 must be an object/],
    [
      'has an empty username',
      [{...ok, username: ''}],
      /entry 0 has no username/,
    ],
    ['has a username that is a number', [{...ok, username: 1}], /no username/],
    ['has no password', [ok, {username: 'bob'}], /user bob has no password/],
    [
      'has a password that is a number',
      [{username: 'bob', password: 1}],
      /bob has no password/,
    ],
    ['has a user twice', [ok, ok], /ann is in the list twice/],
  ];
  for (const [name, content, message] of bad) {
    it(`stops when the file ${name}, and shows no password`, () => {
      let error: Error | undefined;
      try {
        readUsers(usersFileOf(content));
      } catch (err) {
        error = err as Error;
      }

      expect(error?.message).to.match(message);
      expect(error?.message).not.to.containEql(PASSWORD);
      expect(
        JSON.stringify(error, Object.getOwnPropertyNames(error)),
      ).not.to.containEql(PASSWORD);
    });
  }

  it('names the path and the reason when the file cannot be read', () => {
    expect(() => readUsers('/no/such/users.json')).to.throw(
      /cannot be read: \/no\/such\/users\.json \(ENOENT\)/,
    );
  });
});
