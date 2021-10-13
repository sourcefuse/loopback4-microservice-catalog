import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { CONTENT_TYPE, OPERATION_SECURITY_SPEC, STATUS_CODE } from '@sourceloop/core';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import {Channel} from '../models';
import { PermissionKey } from '../permission-key.enum';
import {ChannelRepository} from '../repositories';

const base = '/channels';

export class ChannelController {
  constructor(
    @repository(ChannelRepository)
    public channelRepository : ChannelRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateChannel]})
  @post('/channels',{
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Channel model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Channel)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Channel, {
            title: 'NewChannel',
            exclude: ['id'],
          }),
        },
      },
    })
    channel: Omit<Channel, 'id'>,
  ): Promise<Channel> {
    return this.channelRepository.create(channel);
  }

  @get('/channels/count')
  @response(STATUS_CODE.OK, {
    description: 'Channel model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Channel) where?: Where<Channel>,
  ): Promise<Count> {
    return this.channelRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.ViewChannel]})
  @get('/channels',{
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Channel model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Channel, {includeRelations: true}),
            },
          },
        },
      },
    }
  })
  async find(
    @param.filter(Channel) filter?: Filter<Channel>,
  ): Promise<Channel[]> {
    return this.channelRepository.find(filter);
  }

  @patch('/channels')
  @response(STATUS_CODE.OK, {
    description: 'Channel PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Channel, {partial: true}),
        },
      },
    })
    channel: Channel,
    @param.where(Channel) where?: Where<Channel>,
  ): Promise<Count> {
    return this.channelRepository.updateAll(channel, where);
  }

  @get(`${base}/{id}`)
  @response(STATUS_CODE.OK, {
    description: 'Channel model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Channel, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Channel, {exclude: 'where'}) filter?: FilterExcludingWhere<Channel>
  ): Promise<Channel> {
    return this.channelRepository.findById(id, filter);
  }

  @patch(`${base}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Channel PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Channel, {partial: true}),
        },
      },
    })
    channel: Channel,
  ): Promise<void> {
    await this.channelRepository.updateById(id, channel);
  }

  @put(`${base}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Channel PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() channel: Channel,
  ): Promise<void> {
    await this.channelRepository.replaceById(id, channel);
  }

  @del(`${base}/{id}`)
  @response(STATUS_CODE.NO_CONTENT, {
    description: 'Channel DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.channelRepository.deleteById(id);
  }
}
