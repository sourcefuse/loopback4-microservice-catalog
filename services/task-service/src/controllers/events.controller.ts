import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {EventWorkflowMapping} from '../models';
import {repository} from '@loopback/repository';
import {EventWorkflowMappingRepository} from '../repositories';
import {CONTENT_TYPE, OPERATION_SECURITY_SPEC} from '@sourceloop/core';

const baseUrl = '/events';

export class EventsController {
  constructor(
    @repository(EventWorkflowMappingRepository)
    private readonly eventWorkflowMapping: EventWorkflowMappingRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @post(`${baseUrl}/mapping`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {},
  })
  async mapTaskToWorkflow(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(EventWorkflowMapping, {
            title: 'EventWorkflowMapping',
          }),
        },
      },
    })
    eventWorkflowMapping: Omit<EventWorkflowMapping, 'id'>,
  ) {
    await this.eventWorkflowMapping.create(eventWorkflowMapping);
  }
}
