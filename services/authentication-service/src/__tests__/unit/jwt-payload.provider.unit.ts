import {
  StubbedInstanceWithSinonAccessor,
  createStubInstance,
  expect,
} from '@loopback/testlab';
import {
  RoleRepository,
  UserLevelPermissionRepository,
  UserTenantRepository,
  TenantConfigRepository,
} from '../../repositories';
import sinon from 'sinon';
import {JwtPayloadProvider} from '../../providers';
import {UserPermission} from 'loopback4-authorization';

describe('JWT Payload Provider', () => {
  let roleRepo: StubbedInstanceWithSinonAccessor<RoleRepository>;
  let userLevelPermissionRepo: StubbedInstanceWithSinonAccessor<UserLevelPermissionRepository>;
  let userTenantRepo: StubbedInstanceWithSinonAccessor<UserTenantRepository>;
  let tenantConfigRepo: StubbedInstanceWithSinonAccessor<TenantConfigRepository>;
  let jwtPayloadProvider: JwtPayloadProvider;

  const authUserData = {
    id: 'dummy',
    username: 'test_username',
    password: 'test_password',
  };

  const authClient = {
    clientId: 'test_client_id',
    clientSecret: 'test_client_secret',
  };

  const logger = {
    log,
    info,
    warn,
    error,
    debug,
  };

  const userPermissions = (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    userPermissions: UserPermission<string>[],
    rolePermissions: string[],
  ) => {
    return ['dummy'];
  };

  afterEach(() => sinon.restore());
  beforeEach(setUp);

  describe('jwt payload service', () => {
    it('checks if provider returns a function', async () => {
      const result = jwtPayloadProvider.value();
      expect(result).to.be.Function();
    });

    it('returns error promise if no user exist', async () => {
      const func = jwtPayloadProvider.value();
      const result = func(authUserData, authClient).catch(err => err.message);
      expect(result).to.be.Promise();
    });
  });

  function log() {}

  function info() {}

  function warn() {}

  function error() {}

  function debug() {}

  function setUp() {
    roleRepo = createStubInstance(RoleRepository);
    userLevelPermissionRepo = createStubInstance(UserLevelPermissionRepository);
    userTenantRepo = createStubInstance(UserTenantRepository);
    tenantConfigRepo = createStubInstance(TenantConfigRepository);
    jwtPayloadProvider = new JwtPayloadProvider(
      roleRepo,
      userLevelPermissionRepo,
      userTenantRepo,
      tenantConfigRepo,
      userPermissions,
      logger,
    );
  }
});
