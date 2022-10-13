﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {VideoChatArchiveController} from '../../../controllers';
import {VonageConfig, VonageProvider} from '../../../providers/vonage';
import {
  VideoChatSessionRepository,
  SessionAttendeesRepository,
} from '../../../repositories';
import {ChatArchiveService} from '../../../services/chat-archive.service';
import {VonageService} from '../../../providers/vonage/vonage.service';
import {VideoChatInterface} from '../../../types';
import {
  getArchiveResponse,
  getArchiveResponseList,
  getVideoChatSession,
  setUpMockProvider,
} from '../../helpers';
import {ExternalStorageName} from '../../..';

describe('Archive APIs', () => {
  const archiveId = 'dummy-archive-id';
  const invalidArchiveId = '';

  let videoChatSessionRepo: StubbedInstanceWithSinonAccessor<VideoChatSessionRepository>;
  let sessionAttendeesRepo: StubbedInstanceWithSinonAccessor<SessionAttendeesRepository>;

  let videoChatProvider: VideoChatInterface;
  let vonageService: VonageService;
  let config: VonageConfig;
  let controller: VideoChatArchiveController;
  let chatArchiveService: ChatArchiveService;
  afterEach(() => sinon.restore());

  describe('GET /archives/{archiveId}', () => {
    it('returns an archive object', async () => {
      setUp({getArchives: sinon.stub().returns(getArchiveResponse({}))});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({archiveId: archiveId}));
      const result = await controller.getArchive(archiveId);
      expect(result).to.have.property('sessionId').which.is.a.String();
      sinon.assert.calledWith(findOne, {where: {archiveId}});
    });

    it('returns an error for non-existent archiveId', async () => {
      setUp({getArchives: sinon.stub().returns(getArchiveResponse({}))});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves();
      const error = await controller
        .getArchive(invalidArchiveId)
        .catch(err => err);
      expect(error).instanceOf(Error);
      sinon.assert.calledWith(findOne, {where: {archiveId: invalidArchiveId}});
    });
  });

  describe('GET /archives', () => {
    it('returns an archive list', async () => {
      setUp({getArchives: sinon.stub().returns(getArchiveResponseList({}))});
      const result = await controller.getArchives();
      expect(result).to.have.property('count').which.is.a.Number();
      expect(result).to.have.property('items').which.is.an.Array();
    });

    it('returns a count of zero when no archvies exist', async () => {
      setUp({
        getArchives: sinon
          .stub()
          .returns(getArchiveResponseList({count: 0, items: []})),
      });
      const result = await controller.getArchives();
      expect(result).to.have.property('count').which.eql(0);
      expect(result).to.have.property('items').which.eql([]);
    });
  });

  describe('DEL /archives/{archiveId}', () => {
    it('deletes the archive', async () => {
      setUp({deleteArchive: sinon.stub().resolves()});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves(getVideoChatSession({archiveId: archiveId}));
      await controller.deleteArchive(archiveId);
      sinon.assert.calledWith(findOne, {where: {archiveId}});
    });

    it('returns an error for non-existent archive id', async () => {
      setUp({deleteArchive: sinon.stub().resolves()});
      const findOne = videoChatSessionRepo.stubs.findOne;
      findOne.resolves();
      const error = await controller
        .deleteArchive(invalidArchiveId)
        .catch(err => err);
      expect(error).instanceOf(Error);
      sinon.assert.calledWith(findOne, {where: {archiveId: invalidArchiveId}});
    });
  });

  describe('PUT /archives/storage-target', () => {
    it('sets the upload target with S3 target options', async () => {
      const S3Options = {
        accessKey: '1234',
        secretKey: '****',
        region: 'dummy-region',
        bucket: 'dummy-bucket',
        name: ExternalStorageName.AWSS3,
      };
      await controller.setUploadTarget(S3Options);
    });

    it('sets the upload target with Azure target options', async () => {
      const azureOptions = {
        accountName: '1234',
        accountKey: '1234',
        container: 'dummy-container',
        domain: 'dummy-domain',
        name: ExternalStorageName.AZURE,
      };
      await controller.setUploadTarget(azureOptions);
    });
  });

  function setUp(providerStub: Partial<VideoChatInterface>) {
    config = {
      apiKey: 'dummy',
      apiSecret: 'dummy',
      timeToStart: 30,
    };
    videoChatSessionRepo = createStubInstance(VideoChatSessionRepository);
    sessionAttendeesRepo = createStubInstance(SessionAttendeesRepository);
    const stubbedProvider = setUpMockProvider(providerStub);
    sinon.stub(VonageProvider.prototype, 'value').returns(stubbedProvider);
    vonageService = new VonageService(config, sessionAttendeesRepo);
    videoChatProvider = new VonageProvider(vonageService).value();
    chatArchiveService = new ChatArchiveService(
      videoChatProvider,
      videoChatSessionRepo,
    );
    controller = new VideoChatArchiveController(chatArchiveService);
  }
});
