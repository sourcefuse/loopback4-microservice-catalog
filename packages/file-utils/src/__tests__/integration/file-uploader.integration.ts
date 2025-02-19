import {DataObject} from '@loopback/repository';
import {Client, expect, sinon} from '@loopback/testlab';
import {FileUtilBindings} from '../..';
import {ParentWithFile} from './fixtures/controllers/parent.controller';
import {MulterConfigService} from './fixtures/services/multer-config.service';
import {TestApp} from './fixtures/test.application';
import {setupApplication} from './test-helper';

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
        .post('/parents/no-av-check')
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

    it('should parse a multipart request and accept a binary file', async () => {
      await client
        .post('/parents/binary')
        .attach(
          'file',
          './src/__tests__/integration/fixtures/dummy-files/test.png',
        )
        .field('name', 'testName')
        .expect(204);
    });

    it('should parse a multipart request and throw an error if the binary file type is not allowed', async () => {
      const response = await client
        .post('/parents/binary')
        .attach(
          'file',
          './src/__tests__/integration/fixtures/dummy-files/not-png.png',
        )
        .field('name', 'testName')
        .expect(400);
      expect(response.body.error.message).to.equal(
        'File type not allowed: .jpg',
      );
    });

    it('should parse a multipart request and throw an error if file type is not allowed', async () => {
      const dummyFile = Buffer.from('test', 'utf-8');
      const response = await client
        .post('/parents/no-av-check')
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

    it('should parse a multipart request and should apply only validators applied at config level', async () => {
      // av test should throw no error
      await client
        .post('/parents/no-av-check')
        .attach(
          'file',
          './src/__tests__/integration/fixtures/dummy-files/test.txt',
        )
        .field('name', 'testName')
        .expect(204);

      // file type test should throw an error
      const dummyFile = Buffer.from('test', 'utf-8');
      const response = await client
        .post('/parents/no-av-check')
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

    it('should parse a multipart request and should use config from model if `multipartRequestBody` is used', async () => {
      // should not use av check as it is not specified in the model
      await client
        .post('/parents/model-metadata')
        .attach(
          'file',
          './src/__tests__/integration/fixtures/dummy-files/test.txt',
        )
        .field('name', 'testName')
        .expect(204);

      // file type test should not throw an error if correct type matching model is provided
      await client
        .post('/parents/model-metadata')
        .attach(
          'file',
          './src/__tests__/integration/fixtures/dummy-files/test.png',
        )
        .field('name', 'testName')
        .expect(204);

      // file type test should throw error if incorrect type is provided
      const response = await client
        .post('/parents/model-metadata')
        .attach(
          'file',
          './src/__tests__/integration/fixtures/dummy-files/not-png.png',
        )
        .field('name', 'testName')
        .expect(400);
      expect(response.body.error.message).to.equal(
        'File type not allowed: .jpg',
      );
    });

    describe('limits provider in model settings', () => {
      before(async function () {
        app.bind(FileUtilBindings.LimitProvider).toClass(MulterConfigService);
      });
      it('should parse a multipart request and should use config from MulterConfig provider as limitProvider is true', async () => {
        // file type test should not throw an error if correct type matching model is provided
        await client
          .post('/parents/no-model-metadata')
          .attach(
            'file',
            './src/__tests__/integration/fixtures/dummy-files/test.png',
          )
          .field('name', 'testName')
          .expect(204);
      });

      it('should throw an error if file type is not allowed', async () => {
        // file type test should throw an error
        const dummyFile = Buffer.from('test', 'utf-8');
        const response = await client
          .post('/parents/no-model-metadata')
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

      it('should not throw error as for /parents/model-metadata validators are passed throw model property', async () => {
        // file type test should not throw an error
        await client
          .post('/parents/model-metadata')
          .attach(
            'file',
            './src/__tests__/integration/fixtures/dummy-files/test.txt',
          )
          .field('name', 'testName')
          .expect(204);

        // should not use av check as it is not specified in the model
        await client
          .post('/parents/model-metadata')
          .attach(
            'file',
            './src/__tests__/integration/fixtures/dummy-files/test.txt',
          )
          .field('name', 'testName')
          .expect(204);

        // file type test should not throw an error if correct type matching model is provided
        await client
          .post('/parents/model-metadata')
          .attach(
            'file',
            './src/__tests__/integration/fixtures/dummy-files/test.png',
          )
          .field('name', 'testName')
          .expect(204);
      });
    });

    describe(`ClamAV`, () => {
      before(function () {
        if (!process.env.CLAMAV_HOST || !process.env.CLAMAV_PORT) {
          // eslint-disable-next-line @typescript-eslint/no-invalid-this
          this.skip();
        }
      });
      it('should parse a multipart request and throw an error if the file has a virus', async () => {
        const response = await client
          .post('/parents')
          .attach(
            'file',
            './src/__tests__/integration/fixtures/dummy-files/test.txt',
          )
          .field('name', 'testName')
          .expect(400);
        expect(response.body.error.message).to.equal('Infected file: test.txt');
      });
    });
  });
});
