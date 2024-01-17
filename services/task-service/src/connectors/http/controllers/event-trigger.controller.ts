import {BindingScope, inject, injectable} from '@loopback/core';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {TaskPermssionKey} from '../../../enums/permission-key.enum';
import {TaskServiceBindings} from '../../../keys';
import {Event} from '../../../models';
import {HttpStreamService} from '../http-stream.service';
const baseUrl = '/events';
@injectable({scope: BindingScope.SINGLETON})
export class EventTriggerController {
  constructor(
    @inject(TaskServiceBindings.INCOMING_CONNECTOR)
    private readonly httpStream: HttpStreamService,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [TaskPermssionKey.TriggerEvent],
  })
  @post(`${baseUrl}/trigger`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.CREATED]: {
        description: 'Success response',
      },
    },
  })
  async find(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Event, {
            title: 'EventTrigger',
            exclude: ['timestamp'],
          }),
        },
      },
    })
    event: Event,
  ) {
    await this.httpStream.triggerHandler({
      ...event,
      timestamp: new Date().getTime(),
    });
  }
}
