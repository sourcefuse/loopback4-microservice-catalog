export const enum PermissionKey {
  // @sourceloop/audit-service permissions.
  ViewAudit = 'ViewAudit',
  CreateAudit = 'CreateAudit',
  UpdateAudit = 'UpdateAudit',
  DeleteAudit = 'DeleteAudit',

  // @sourceloop/bpmn-service permissions.
  ViewWorkflow = 'ViewWorkflow',
  CreateWorkflow = 'CreateWorkflow',
  UpdateWorkflow = 'UpdateWorkflow',
  DeleteWorkflow = 'DeleteWorkflow',

  // @sourceloop/chat-service permissions.
  ViewMessage = 'ViewMessage',
  CreateMessage = 'CreateMessage',
  UpdateMessage = 'UpdateMessage',
  DeleteMessage = 'DeleteMessage',

  CreateMessageRecipient = 'CreateMessageRecipient',
  ViewMessageRecipient = 'ViewMessageRecipient',
  UpdateMessageRecipient = 'UpdateMessageRecipient',
  DeleteMessageRecipient = 'DeleteMessageRecipient',

  CreateAttachmentFile = 'CreateAttachmentFile',
  ViewAttachmentFile = 'ViewAttachmentFile',
  UpdateAttachmentFile = 'UpdateAttachmentFile',
  DeleteAttachmentFile = 'DeleteAttachmentFile',

  // @sourceloop/feature-toggle-service permissions.
  ViewFeature = 'ViewFeature',
  CreateFeature = 'CreateFeature',
  UpdateFeature = 'UpdateFeature',
  DeleteFeature = 'DeleteFeature',

  ViewStrategy = 'ViewStrategy',
  CreateStrategy = 'CreateStrategy',
  UpdateStrategy = 'UpdateStrategy',
  DeleteStrategy = 'DeleteStrategy',

  ViewFeatureToggle = 'ViewFeatureToggle',
  CreateFeatureToggle = 'CreateFeatureToggle',
  UpdateFeatureToggle = 'UpdateFeatureToggle',
  DeleteFeatureToggle = 'DeleteFeatureToggle',

  // @sourceloop/in-mail-service permissions.
  ComposeMail = 'ComposeMail',
  UpdateMail = 'UpdateMail',
  ReplyMail = 'ReplyMail',
  AddAttachments = 'AddAttachments',
  GetThreads = 'GetThreads',
  GetThread = 'GetThread',
  GetInMails = 'GetInMails',
  GetInMail = 'GetInMail',
  TrashMail = 'TrashMail',
  RestoreMail = 'RestoreMail',
  GetInMailAttachments = 'GetInMailAttachments',
  GetMetadata = 'GetMetadata',
  DeleteAttachment = 'DeleteAttachment',

  // @sourceloop/notification-service permissions.
  ViewNotification = 'ViewNotification',
  CreateNotification = 'CreateNotification',
  UpdateNotification = 'UpdateNotification',
  DeleteNotification = 'DeleteNotification',
  CanGetNotificationAccess = 'CanGetNotificationAccess',

  // @sourceloop/payment-service permissions.
  GetSubscriptionCount = 'GetSubscriptionCount',
  CreateSubscription = 'CreateSubscription',
  GetSubscriptions = 'GetSubscriptions',
  UpdateSubscriptions = 'UpdateSubscriptions',
  DeleteSubscriptions = 'DeleteSubscriptions',

  // @sourceloop/scheduler-service permissions.
  NotAllowed = 'NotAllowed',

  ViewSubscription = 'ViewSubscription',
  UpdateSubscription = 'UpdateSubscription',
  DeleteSubscription = 'DeleteSubscription',

  ViewEvent = 'ViewEvent',
  CreateEvent = 'CreateEvent',
  UpdateEvent = 'UpdateEvent',
  DeleteEvent = 'DeleteEvent',
  HardDeleteEvent = 'HardDeleteEvent',

  ViewCalendar = 'ViewCalendar',
  CreateCalendar = 'CreateCalendar',
  UpdateCalendar = 'UpdateCalendar',
  DeleteCalendar = 'DeleteCalendar',

  ViewAttachment = 'ViewAttachment',
  CreateAttachment = 'CreateAttachment',
  UpdateAttachment = 'UpdateAttachment',

  ViewAttendee = 'ViewAttendee',
  CreateAttendee = 'CreateAttendee',
  UpdateAttendee = 'UpdateAttendee',
  DeleteAttendee = 'DeleteAttendee',

  ViewSettings = 'ViewSettings',
  CreateSettings = 'CreateSettings',
  UpdateSettings = 'UpdateSettings',
  DeleteSettings = 'DeleteSettings',

  ViewTheme = 'ViewTheme',
  CreateTheme = 'CreateTheme',
  UpdateTheme = 'UpdateTheme',
  DeleteTheme = 'DeleteTheme',

  ViewWorkingHour = 'ViewWorkingHour',
  CreateWorkingHour = 'CreateWorkingHour',
  UpdateWorkingHour = 'UpdateWorkingHour',
  DeleteWorkingHour = 'DeleteWorkingHour',

  // @sourceloop/user-tenant-service permissions.
  CreateUserGroup = 'CreateUserGroup',
  ViewUserGroupList = 'ViewUserGroupList',
  UpdateUserGroup = 'UpdateUserGroup',
  DeleteUserGroup = 'DeleteUserGroup',

  ViewRoles = 'ViewRoles',
  CreateRoles = 'CreateRoles',
  UpdateRoles = 'UpdateRoles',
  DeleteRoles = 'DeleteRoles',

  ViewAnyUser = 'ViewAnyUser',
  ViewTenantUser = 'ViewTenantUser',
  ViewTenantUserRestricted = 'ViewTenantUserRestricted',
  ViewAllUser = 'ViewAllUser',
  ViewOwnUser = 'ViewOwnUser',
  CreateAnyUser = 'CreateAnyUser',
  CreateTenantUser = 'CreateTenantUser',
  CreateTenantUserRestricted = 'CreateTenantUserRestricted',
  UpdateAnyUser = 'UpdateAnyUser',
  UpdateOwnUser = 'UpdateOwnUser',
  UpdateTenantUser = 'UpdateTenantUser',
  UpdateTenantUserRestricted = 'UpdateTenantUserRestricted',
  DeleteAnyUser = 'DeleteAnyUser',
  DeleteTenantUser = 'DeleteTenantUser',
  DeleteTenantUserRestricted = 'DeleteTenantUserRestricted',

  CreateTenant = 'CreateTenant',
  ViewTenant = 'ViewTenant',
  UpdateTenant = 'UpdateTenant',
  ViewOwnTenant = 'ViewOwnTenant',
  UpdateOwnTenant = 'UpdateOwnTenant',
  DeleteTenant = 'DeleteTenant',
  AddMemberToUserGroup = 'AddMemberToUserGroup',
  UpdateMemberInUserGroup = 'UpdateMemberInUserGroup',
  RemoveMemberFromUserGroup = 'RemoveMemberFromUserGroup',
  LeaveUserGroup = 'LeaveUserGroup',
  UpdateUserTenantPreference = 'UpdateUserTenantPreference',
  ViewUserTenantPreference = 'ViewUserTenantPreference',

  // @sourceloop/video-conferencing-service permissions.
  CreateSession = 'CreateMeetingSession',
  GenerateToken = 'GenerateMeetingToken',
  StartArchive = 'StartMeetingArchive',
  StopArchive = 'StopMeetingArchive',
  GetArchives = 'GetMeetingArchives',
  DeleteArchive = 'DeleteMeetingArchive',
  StopMeeting = 'StopMeeting',
  SetUploadTarget = 'SetMeetingUploadTarget',
  GetAttendees = 'GetMeetingAttendees',
  EditMeeting = 'EditMeeting',

  // @sourceloop/audit-service permissions.
  ViewAuditNum = '1',
  CreateAuditNum = '2',
  UpdateAuditNum = '3',
  DeleteAuditNum = '4',

  // @sourceloop/bpmn-service permissions.
  ViewWorkflowNum = '5',
  CreateWorkflowNum = '6',
  UpdateWorkflowNum = '7',
  DeleteWorkflowNum = '8',

  // @sourceloop/chat-service permissions.
  ViewMessageNum = '9',
  CreateMessageNum = '10',
  UpdateMessageNum = '11',
  DeleteMessageNum = '12',

  CreateMessageRecipientNum = '13',
  ViewMessageRecipientNum = '14',
  UpdateMessageRecipientNum = '15',
  DeleteMessageRecipientNum = '16',

  CreateAttachmentFileNum = '17',
  ViewAttachmentFileNum = '18',
  UpdateAttachmentFileNum = '19',
  DeleteAttachmentFileNum = '20',

  // @sourceloop/feature-toggle-service permissions.
  ViewFeatureNum = '21',
  CreateFeatureNum = '22',
  UpdateFeatureNum = '23',
  DeleteFeatureNum = '24',

  ViewStrategyNum = '25',
  CreateStrategyNum = '26',
  UpdateStrategyNum = '27',
  DeleteStrategyNum = '28',

  ViewFeatureToggleNum = '29',
  CreateFeatureToggleNum = '30',
  UpdateFeatureToggleNum = '31',
  DeleteFeatureToggleNum = '32',

  // @sourceloop/in-mail-service permissions.
  ComposeMailNum = '33',
  UpdateMailNum = '34',
  ReplyMailNum = '35',
  AddAttachmentsNum = '36',
  GetThreadsNum = '37',
  GetThreadNum = '38',
  GetInMailsNum = '39',
  GetInMailNum = '40',
  TrashMailNum = '41',
  RestoreMailNum = '42',
  GetInMailAttachmentsNum = '43',
  GetMetadataNum = '44',
  DeleteAttachmentNum = '45',

  // @sourceloop/notification-service permissions.
  ViewNotificationNum = '46',
  CreateNotificationNum = '47',
  UpdateNotificationNum = '48',
  DeleteNotificationNum = '49',
  CanGetNotificationAccessNum = '50',

  // @sourceloop/payment-service permissions.
  GetSubscriptionCountNum = '51',
  CreateSubscriptionNum = '52',
  GetSubscriptionsNum = '53',
  UpdateSubscriptionsNum = '54',
  DeleteSubscriptionsNum = '55',

  // @sourceloop/scheduler-service permissions.
  NotAllowedNum = '56',

  ViewSubscriptionNum = '57',
  UpdateSubscriptionNum = '58',
  DeleteSubscriptionNum = '59',

  ViewEventNum = '60',
  CreateEventNum = '61',
  UpdateEventNum = '62',
  DeleteEventNum = '63',
  HardDeleteEventNum = '64',

  ViewCalendarNum = '65',
  CreateCalendarNum = '66',
  UpdateCalendarNum = '67',
  DeleteCalendarNum = '68',

  ViewAttachmentNum = '69',
  CreateAttachmentNum = '70',
  UpdateAttachmentNum = '71',

  ViewAttendeeNum = '72',
  CreateAttendeeNum = '73',
  UpdateAttendeeNum = '74',
  DeleteAttendeeNum = '75',

  ViewSettingsNum = '76',
  CreateSettingsNum = '77',
  UpdateSettingsNum = '78',
  DeleteSettingsNum = '79',

  ViewThemeNum = '80',
  CreateThemeNum = '81',
  UpdateThemeNum = '82',
  DeleteThemeNum = '83',

  ViewWorkingHourNum = '84',
  CreateWorkingHourNum = '85',
  UpdateWorkingHourNum = '86',
  DeleteWorkingHourNum = '87',

  // @sourceloop/user-tenant-service permissions.
  CreateUserGroupNum = '88',
  ViewUserGroupListNum = '89',
  UpdateUserGroupNum = '90',
  DeleteUserGroupNum = '91',

  ViewRolesNum = '92',
  CreateRolesNum = '93',
  UpdateRolesNum = '94',
  DeleteRolesNum = '95',

  ViewAnyUserNum = '96',
  ViewTenantUserNum = '97',
  ViewTenantUserRestrictedNum = '98',
  ViewAllUserNum = '99',
  ViewOwnUserNum = '100',
  CreateAnyUserNum = '101',
  CreateTenantUserNum = '102',
  CreateTenantUserRestrictedNum = '103',
  UpdateAnyUserNum = '104',
  UpdateOwnUserNum = '105',
  UpdateTenantUserNum = '106',
  UpdateTenantUserRestrictedNum = '107',
  DeleteAnyUserNum = '108',
  DeleteTenantUserNum = '109',
  DeleteTenantUserRestrictedNum = '110',
  CreateTenantNum = '111',
  ViewTenantNum = '112',
  UpdateTenantNum = '113',
  ViewOwnTenantNum = '114',
  UpdateOwnTenantNum = '115',
  DeleteTenantNum = '116',
  AddMemberToUserGroupNum = '117',
  UpdateMemberInUserGroupNum = '118',
  RemoveMemberFromUserGroupNum = '119',
  LeaveUserGroupNum = '120',
  UpdateUserTenantPreferenceNum = '121',
  ViewUserTenantPreferenceNum = '122',

  // @sourceloop/video-conferencing-service permissions.
  CreateSessionNum = '123',
  GenerateTokenNum = '124',
  StartArchiveNum = '125',
  StopArchiveNum = '126',
  GetArchivesNum = '127',
  DeleteArchiveNum = '128',
  StopMeetingNum = '129',
  SetUploadTargetNum = '130',
  GetAttendeesNum = '131',
  EditMeetingNum = '132',
}
