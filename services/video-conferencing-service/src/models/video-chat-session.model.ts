import {model, property} from '@loopback/repository';
import {UserModifiableEntity} from '@sourcefuse-service-catalog/core';

@model({
  name: 'video_session_details',
})
export class VideoChatSession extends UserModifiableEntity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    name: 'session_id',
  })
  sessionId: string;

  @property({
    type: 'string',
    required: true,
    name: 'meeting_link',
  })
  meetingLink: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
    name: 'is_scheduled',
  })
  isScheduled: boolean;

  @property({
    type: 'date',
    name: 'schedule_time',
  })
  scheduleTime?: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
    name: 'is_archived',
  })
  isArchived: boolean;

  @property({
    type: 'string',
    name: 'archive_id',
  })
  archiveId?: string;

  @property({
    type: 'string',
    name: 'upload_target',
  })
  uploadTarget?: string;

  @property({
    type: 'date',
    name: 'start_time',
  })
  startTime?: Date;

  @property({
    type: 'date',
    name: 'end_time',
  })
  endTime?: Date;

  constructor(data?: Partial<VideoChatSession>) {
    super(data);
  }
}
