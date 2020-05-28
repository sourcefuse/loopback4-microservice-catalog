// import {HttpErrors} from '@loopback/rest';
// import {
//   createStubInstance,
//   expect,
//   StubbedInstanceWithSinonAccessor,
// } from '@loopback/testlab';
// import {VideoChatController} from '../../../controllers';
// import {VideoChatSessionRepository} from '../../../repositories';
// import {VideoChatProvider} from '../../../providers';
// import sinon from 'sinon';


// describe('Session APIs', () => {
//   let videoChatRepo: StubbedInstanceWithSinonAccessor<VideoChatSessionRepository>;
//   let videoChatProvider: StubbedInstanceWithSinonAccessor<VideoChatProvider>;
//   let controller: VideoChatController;
//   beforeEach(reset);

//   describe('POST /session', () => {
//     it('returns a meeting Id of type string and saves the session Id', async () => {
//       const meetingOptions = {
//         isScheduled: false,
//       };

//       const create = videoChatRepo.stubs.create;
//       create.resolves();
//       const result = await controller.create(meetingOptions);
//       expect(result).to.be.a.String();
//       sinon.assert.called(create);
//     });

//     it('schedules a meeting', async () => {
//       const meetingOptions = {
//         isScheduled: true,
//         scheduleTime: new Date(2020, 12),
//       };

//       const create = videoChatRepo.stubs.create;
//       create.resolves();
//       const result = await controller.create(meetingOptions);
//       expect(result).to.be.a.String();
//       sinon.assert.called(create);
//     });

//     it('only schedules a meeting with a schedule time', async () => {
//       const meetingOptions = {
//         isScheduled: true,
//       };

//       const error = await controller.create(meetingOptions).catch(err => {
//         return err;
//       });
//       expect(error).instanceof(HttpErrors);
//     });

//     it('does not schedule a meeting if schedule time is in the past', async () => {
//       const meetingOptions = {
//         isScheduled: true,
//         scheduleTime: new Date(2018, 12),
//       };

//       const error = await controller.create(meetingOptions).catch(err => {
//         return err;
//       });
//       expect(error).instanceof(HttpErrors);
//     });
//   });

//   describe('POST /session/{meetingId}/token', () => {
//     it('returns a session Id and token of type string', async () => {
//       const sessionOptions = {
//         meetingId: 'meeting-id',
//         expireTime: new Date(2020, 12),
//       };

//       const find = videoChatRepo.stubs.find;
//       find.resolves({sessionId: 'sessionId'}); // will have more properties wrt the model, will create a helper function for that
//       const result = await controller.getToken(sessionOptions);
//       expect(result.sessionId).to.be.a.String();
//       expect(result.token).to.be.a.String();
//       sinon.assert.called(find);
//     });

//     it('gives an error for invalid meeting Id', async () => {
//       const sessionOptions = {
//         meetingId: '',
//         expireTime: new Date(2020, 12),
//       };

//       const find = videoChatRepo.stubs.find;
//       find.resolves();
//       const error = await controller.getToken(sessionOptions).catch(err => {
//         return err;
//       });
//       expect(error).instanceof(HttpErrors);
//       sinon.assert.called(find);
//     });

//     it('denies if the threshold time to join has not been achieved (scheduling logic)', async () => {
//       const sessionOptions = {
//         meetingId: '',
//         expireTime: new Date(2020, 12),
//       };

//       const find = videoChatRepo.stubs.find;
//       find.resolves({scheduleTime: new Date(2021, 12)}); // will have more properties wrt the model, will create a helper function for that
//       const error = await controller.getToken(sessionOptions).catch(err => {
//         return err;
//       });
//       expect(error).instanceof(HttpErrors);
//       sinon.assert.called(find);
//     });
//   });

//   describe('PATCH /session/{meetingId}/end', () => {
//     it('updates the end time', async () => {
//       const update = videoChatRepo.stubs.update;
//       update.resolves();
//       await controller.endMeeting();
//       sinon.assert.called(update);
//     });
//   });

//   function reset() {
//     videoChatRepo = createStubInstance(VideoChatSessionRepository);
//     videoChatProvider = createStubInstance(VideoChatProvider);
//     controller = new VideoChatController(videoChatRepo, videoChatProvider);
//   }
// });
