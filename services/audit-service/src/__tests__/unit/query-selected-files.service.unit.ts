import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {expect, sinon} from '@loopback/testlab';
import {AuditServiceApplication} from '../../application';
import {QuerySelectedFilesProvider} from '../../services';

const FILE_NAME = 'archive.csv';

describe('QuerySelectedFilesProvider getFileContent', () => {
  let sendStub: sinon.SinonStub;

  beforeEach(() => {
    sendStub = sinon.stub(S3Client.prototype, 'send');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('parses the csv from the streamed S3 object body', async () => {
    const csv = 'id,actedOn,actor\n1,Product,testUser\n2,User,otherUser';
    // v3 returns a stream; only transformToString yields the content
    sendStub.resolves({Body: {transformToString: () => Promise.resolve(csv)}});
    const provider = new QuerySelectedFilesProvider(
      {} as AuditServiceApplication,
      {accessKeyId: 'key', secretAccessKey: 'secret', region: 'us-east-1'},
    );

    const records = await provider.getFileContent(FILE_NAME);

    expect(records).to.deepEqual([
      {id: '1', actedOn: 'Product', actor: 'testUser'},
      {id: '2', actedOn: 'User', actor: 'otherUser'},
    ]);
    const command = sendStub.firstCall.args[0];
    expect(command).to.be.instanceOf(GetObjectCommand);
    expect(command.input.Key).to.equal(FILE_NAME);
  });

  describe('credentials', () => {
    // Point every default-chain source at nothing, so only an explicit key
    // pair can resolve; IMDS is disabled to keep the test offline.
    const envOverrides: Record<string, string | undefined> = {
      AWS_ACCESS_KEY_ID: undefined,
      AWS_SECRET_ACCESS_KEY: undefined,
      AWS_SESSION_TOKEN: undefined,
      AWS_PROFILE: undefined,
      AWS_WEB_IDENTITY_TOKEN_FILE: undefined,
      AWS_CONTAINER_CREDENTIALS_RELATIVE_URI: undefined,
      AWS_CONTAINER_CREDENTIALS_FULL_URI: undefined,
      AWS_SHARED_CREDENTIALS_FILE: '/nonexistent/aws-credentials',
      AWS_CONFIG_FILE: '/nonexistent/aws-config',
      AWS_EC2_METADATA_DISABLED: 'true',
    };
    const envKeys = Object.keys(envOverrides);
    let savedEnv: Record<string, string | undefined>;

    beforeEach(() => {
      savedEnv = Object.fromEntries(envKeys.map(k => [k, process.env[k]]));
      envKeys.forEach(k => {
        if (envOverrides[k] === undefined) delete process.env[k];
        else process.env[k] = envOverrides[k];
      });
      sendStub.resolves({});
    });

    afterEach(() => {
      envKeys.forEach(k => {
        if (savedEnv[k] === undefined) delete process.env[k];
        else process.env[k] = savedEnv[k];
      });
    });

    it('passes the static key pair when one is configured', async () => {
      const provider = new QuerySelectedFilesProvider(
        {} as AuditServiceApplication,
        {accessKeyId: 'key', secretAccessKey: 'secret', region: 'us-east-1'},
      );

      await provider.getFileContent(FILE_NAME);

      const resolve = sendStub.firstCall.thisValue.config.credentials;
      expect(await resolve()).to.containDeep({
        accessKeyId: 'key',
        secretAccessKey: 'secret',
      });
    });

    it('leaves credentials unset without a key pair so the default chain applies', async () => {
      const provider = new QuerySelectedFilesProvider(
        {} as AuditServiceApplication,
      );

      await provider.getFileContent(FILE_NAME);

      // An explicit empty key pair would resolve; the default chain finds
      // nothing here and rejects.
      const resolve = sendStub.firstCall.thisValue.config.credentials;
      await expect(resolve()).to.be.rejected();
    });
  });

  it('returns undefined when the object has no body', async () => {
    sendStub.resolves({});
    const provider = new QuerySelectedFilesProvider(
      {} as AuditServiceApplication,
    );

    expect(await provider.getFileContent(FILE_NAME)).to.be.undefined();
  });
});
