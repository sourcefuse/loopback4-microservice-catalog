import {Inject, Injectable} from '@angular/core';
import {CreateStrategy, LinkStrategy} from '../../../../interfaces';
import {ModdleElement} from '../../../../types/bpmn.types';
import {UtilsService} from '../../../utils.service';
import {CREATE_TASK_STRATEGY} from '../../strategies/create';
import {ENV} from '../../../../types/base.types';
import {LINK_BASIC_STRATEGY} from '../../strategies/link';
import {ServiceTaskElement} from './service-task.task';

@Injectable()
export class SendEmail extends ServiceTaskElement {
  constructor(
    @Inject(CREATE_TASK_STRATEGY)
    protected creator: CreateStrategy<ModdleElement>,
    @Inject(LINK_BASIC_STRATEGY)
    protected linker: LinkStrategy<ModdleElement>,
    @Inject('env') private env: ENV,
    public utils: UtilsService,
  ) {
    super();
    this.attributes = {
      ...this.attributes,
      'camunda:topic': `send-alert-${this.env.envIdentifier}`,
    };
  }
  name = 'Send Email';
  properties = {};
  inputs = {
    name: 'notificationParams',
    fields: {
      taskIds: {
        from: 'taskIds',
      },
      type: {
        value: 'email',
      },
      alertTemplate: {
        value: 'custom',
      },
      recipientType: {
        value: 'specific_people',
      },
      recipients: {
        state: 'email',
      },
      message: {
        state: 'body',
      },
      subject: {
        state: 'subject',
      },
      peopleColumnId: {
        state: 'peopleColumnId',
      },
    },
  };
  outputs: string;
}
