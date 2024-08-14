import {Client, expect, sinon} from '@loopback/testlab';
import {TestApp} from './fixtures/test.application';
import {setupApplication} from './test-helper';
import {ParentWithFile} from './fixtures/controllers/parent.controller';
import {DataObject} from '@loopback/repository';

describe('FileUploaderComponent', () => {
  let app: TestApp;
  let client: Client;
  let receiverStub: {
    receive: sinon.SinonStub<[DataObject<ParentWithFile>], void>;
  };
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    receiverStub = {
      receive: sinon.stub(),
    };
    app.bind('services.ReceiverStub').to(receiverStub);
  });

  after(async () => {
    await app.stop();
  });
  afterEach(() => {
    sinon.reset();
  });
  describe('text files', () => {
    it('should parse a multipart request and receive the file', async () => {
      const dummyFile = Buffer.from('test', 'utf-8');
      await client
        .post('/parents')
        .attach('file', dummyFile, {
          filename: 'test.csv',
          contentType: 'text/csv',
        })
        .field('name', 'testName')
        .expect(204);
      sinon.assert.calledOnce(receiverStub.receive);
      expect(receiverStub.receive.getCalls()[0].args[0]).deepEqual({
        file: {
          fieldname: 'file',
          originalname: 'test.csv',
          encoding: '7bit',
          mimetype: 'text/csv',
          buffer: Buffer.from('test', 'utf-8'),
          size: 4,
        },
        name: 'testName',
      });
    });
    it('should parse a multipart request and throw an error if file file type is not allowed', async () => {
      const dummyFile = Buffer.from('test', 'utf-8');
      const response = await client
        .post('/parents')
        .attach('file', dummyFile, {
          filename: 'test.svg',
          contentType: 'image/svg+xml',
        })
        .field('name', 'testName')
        .expect(400);
      expect(response.body.error.message).to.equal(
        'File type not allowed: .svg',
      );
    });
  });
});
