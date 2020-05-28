export class VideoChatArchiveController {
  constructor() {}

  // @authorize(['CreateArchive'])
  // @post('/archive', {
  //   responses: {
  //     [STATUS_CODE.OK]: {
  //       content: {
  //         [CONTENT_TYPE.TEXT]: {schema: getModelSchemaRef(VideoChatSession)},
  //       },
  //     },
  //   },
  // })
  // async createArchive(
  //   @requestBody()
  //   meetingOptions: MeetingOptions,
  // ): Promise<string> {
  //   return 'meetingLink'; // return this.videoChatProvider.getMeetingLink(meetingOptions);
  // }

  // @authorize(['ViewSessionToken'])
  // @post('/session/{meetingLink}/token', {
  //   responses: {
  //     [STATUS_CODE.OK]: {
  //       description: 'Notification model instance',
  //       content: {
  //         [CONTENT_TYPE.TEXT]: {schema: getModelSchemaRef(VideoChatSession)},
  //       },
  //     },
  //   },
  // })
  // async getMeetingToken(
  //   @requestBody()
  //   sessionOptions: SessionOptions,
  //   @param.path.string('meetingLink') meetingLink: string,
  // ): Promise<SessionResponse> {
  //   return {sessionId: 'session_one', token: 'secret_token'}; // return this.videoChatProvider.getToken(sessionOptions);
  // }

  // @authorize(['UpdateSession'])
  // @patch('/session/{meetingLink}/end', {
  //   responses: {
  //     [STATUS_CODE.OK]: {
  //       description: 'Notification model instance',
  //       content: {
  //         [CONTENT_TYPE.TEXT]: {schema: getModelSchemaRef(VideoChatSession)},
  //       },
  //     },
  //   },
  // })
  // async endSession(
  //   @requestBody()
  //   sessionOptions: SessionOptions,
  //   @param.path.string('meetingLink') meetingLink: string,
  // ): Promise<void> {}
}
