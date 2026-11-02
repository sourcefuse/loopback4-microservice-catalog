# auth-multitenant-example

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

#### API Details

Visit the [OpenAPI spec docs](./openapi.md)

#### Seeded users and tests

The migrations seed a client and two users (`john.doe@example.com` and `sarah.rafferty@example.com`) with a
bcrypt hash of their password. The password itself is not published here. To log in, or to run the
acceptance tests, use a password that matches the hash in
`migrations/sqls/20201217172051-init-seed-up.sql`, or replace the hash with one of your own. Pass the same
password to the tests as `TEST_USER_PASSWORD`:

```bash
TEST_USER_PASSWORD='<Enter test password>' npm test
```
