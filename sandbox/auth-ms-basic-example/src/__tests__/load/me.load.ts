import {load, template, token} from '@sourceloop/load-testing';

load.describe(
  'Auth',
  {headers: {authorization: template`Bearer ${token()}`}},
  () => {
    load.it('current user', [load.get('/auth/me')]);
  },
);
