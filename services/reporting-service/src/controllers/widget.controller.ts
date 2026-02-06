import {Filter, repository} from '@loopback/repository';
import {del, get, param, patch, post, requestBody} from '@loopback/rest';
import {CONTENT_TYPE, getModelSchemaRefSF} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKeys} from '../enums';
import {Widget} from '../models';
import {WidgetsRepository} from '../repositories';
const WIDGET_URL = '/widgets/{id}';
export class WidgetController {
  constructor(
    @repository(WidgetsRepository)
    public widgetRepository: WidgetsRepository,
  ) {}
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.CreateWidget]})
  @post('/widgets', {
    responses: {
      '200': {
        description: 'Widget model instance',
        content: {'application/json': {schema: {'x-ts-type': Widget}}},
      },
    },
  })
  /**
   * The create function accepts a widget object, excluding the 'id' property, and returns a Promise
   * that resolves to a new Widget.
   * @param widget - The `widget` parameter is an object of type `Widget` with the `id` property
   * excluded. It represents the data for creating a new widget.
   * @returns The `create` function is returning a Promise that resolves to a `Widget` object.
   */
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(Widget, {
            title: 'new Widget',
            exclude: ['id'],
          }),
        },
      },
    })
    widget: Omit<Widget, 'id'>,
  ): Promise<Widget> {
    return this.widgetRepository.create(widget);
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.ViewWidgetList]})
  @get('/widgets', {
    responses: {
      '200': {
        description: 'Array of Widget model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Widget}},
          },
        },
      },
    },
  })
  /**
   * The find function returns a promise that resolves to an array of widgets based on the provided
   * filter.
   * @param [filter] - The `filter` parameter is an optional parameter of type `Filter<Widget>`. It is
   * used to specify the filtering criteria for the `find` operation. The `Filter` type is a generic
   * type that allows you to define the filtering criteria based on the properties of the `Widget`
   * entity.
   * @returns The find method is returning a Promise that resolves to an array of Widget objects.
   */
  async find(@param.filter(Widget) filter?: Filter<Widget>): Promise<Widget[]> {
    return this.widgetRepository.find(filter);
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.ViewWidget]})
  @get(WIDGET_URL, {
    responses: {
      '200': {
        description: 'Widget model instance',
        content: {'application/json': {schema: {'x-ts-type': Widget}}},
      },
    },
  })
  /**
   * The function findById takes an id parameter and returns a Promise that resolves to a Widget
   * object.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of a
   * widget.
   * @returns a Promise that resolves to a Widget object.
   */
  async findById(@param.path.string('id') id: string): Promise<Widget> {
    return this.widgetRepository.findById(id);
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.ViewWidgetList]})
  @get('/widgets/count', {
    responses: {
      '200': {
        description: 'Count Widgets',
        content: {
          'application/json': {
            schema: {type: 'object', properties: {count: {type: 'number'}}},
          },
        },
      },
    },
  })
  /**
   * The count function returns the number of widgets that match the given filter.
   * @param [filter] - The `filter` parameter is an optional parameter of type `Filter<Widget>`. It is
   * used to specify the filtering criteria for the count operation. The `Filter` type is a generic
   * type that allows you to define the filtering criteria for a specific entity type. In this case,
   * the `Widget
   * @returns The count method is returning a Promise that resolves to an object with a single property
   * "count" which is a number.
   */
  async count(
    @param.filter(Widget) filter?: Filter<Widget>,
  ): Promise<{count: number}> {
    return this.widgetRepository.count(filter?.where);
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.UpdateWidget]})
  @patch(WIDGET_URL, {
    responses: {
      '204': {
        description: 'Widget PATCH success',
      },
    },
  })
  /**
   * The function updates a widget by its ID.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * widget that needs to be updated.
   * @param widget - The `widget` parameter is of type `Partial<Widget>`, which means it is an object
   * that contains some or all of the properties of the `Widget` type. The `Partial` type allows you to
   * update only specific properties of the `Widget` object instead of updating all properties at once
   */
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() widget: Partial<Widget>,
  ): Promise<void> {
    await this.widgetRepository.updateById(id, widget);
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.DeleteWidget]})
  @del(WIDGET_URL, {
    responses: {
      '204': {
        description: 'Widget DELETE success',
      },
    },
  })
  /**
   * The function deletes a widget from the repository based on its ID.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * widget that needs to be deleted.
   */
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.widgetRepository.deleteById(id);
  }
}
