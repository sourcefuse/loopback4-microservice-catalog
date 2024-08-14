import {Client, expect, sinon} from '@loopback/testlab';
import {TestApp} from './fixtures/test.application';
import {DataObject} from '@loopback/repository';
import {ParentWithFile} from './fixtures/controllers/parent.controller';
import {setupApplication} from './test-helper';
import {config} from 'dotenv';

config();
describe('FileUploaderComponent: S3 Upload', () => {
  let app: TestApp;
  let client: Client;
  let receiverStub: {
    receive: sinon.SinonStub<[DataObject<ParentWithFile>], void>;
  };

  before(function () {
    if (
      !process.env.AWS_SECRET ||
      !process.env.AWS_ACCESS_KEY ||
      !process.env.AWS_REGION ||
      !process.env.AWS_S3_BUCKET
    ) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this.skip();
    }
  });

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    receiverStub = {
      receive: sinon.stub(),
    };
    app.bind('services.ReceiverStub').to(receiverStub);
  });

  after(async () => {
    await app?.stop();
  });
  afterEach(() => {
    sinon.reset();
  });
  describe('text files', () => {
    it('should parse a multipart request and receive the file in s3 if storage is MulterS3', async () => {
      const dummyFile = Buffer.from('test', 'utf-8');
      await client
        .post('/parents/s3')
        .attach('file', dummyFile, {
          filename: 'test.csv',
          contentType: 'text/csv',
        })
        .field('name', 'testName')
        .expect(204);
      sinon.assert.calledOnce(receiverStub.receive);
      const received = receiverStub.receive.getCalls()[0].args[0];
      expect(received).to.have.properties(['file', 'name']);
      expect(received.file?.fieldname).to.equal('file');
      expect(received.file?.originalname).to.equal('test.csv');
      expect(received.file?.encoding).to.equal('7bit');
      expect(received.file?.mimetype).to.equal('text/csv');
      expect(received.file?.size).to.equal(4);
      expect(received.name).to.equal('testName');
    });
  });
});
