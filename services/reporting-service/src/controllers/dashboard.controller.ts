import {Filter, repository} from '@loopback/repository';
import {del, get, param, patch, post, requestBody} from '@loopback/rest';
import {CONTENT_TYPE, getModelSchemaRefSF} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKeys} from '../enums';
import {DashboardWithWidgets} from '../interfaces/dashboard-with-widgets.interface';
import {CreateDashboardDto, Dashboard} from '../models';
import {DashboardRepository, DashboardWidgetRepository} from '../repositories';
const DASHBOARD_URL = `/dashboards/{id}`;
export class DashboardController {
  constructor(
    @repository(DashboardRepository)
    public dashboardRepository: DashboardRepository,
    @repository(DashboardWidgetRepository)
    public dashboardWidgetRepository: DashboardWidgetRepository,
  ) {}
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.CreateDashboard]})
  @post('/dashboards', {
    responses: {
      '200': {
        description: 'Dashboard model instance',
        content: {'application/json': {schema: {'x-ts-type': Dashboard}}},
      },
    },
  })
  /**
   * The `create` function creates a new dashboard with the provided data and associates it with the
   * specified widgets.
   * @param {CreateDashboardDto} createDashboardDto - The `createDashboardDto` parameter is an object
   * that contains the data needed to create a new dashboard. It has the following properties:
   * @returns a Promise that resolves to a Dashboard object.
   */
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRefSF(CreateDashboardDto, {
            title: 'NewDashboard',
          }),
        },
      },
    })
    createDashboardDto: CreateDashboardDto,
  ): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.create({
      name: createDashboardDto.name,
      description: createDashboardDto.description,
      layout: createDashboardDto.layout,
    });

    // Handle Widget Associations using createAll
    if (createDashboardDto.widgetIds?.length) {
      const dashboardWidgetData = createDashboardDto.widgetIds.map(
        widgetId => ({
          dashboardId: dashboard.id,
          widgetId: widgetId,
        }),
      );

      await this.dashboardWidgetRepository.createAll(dashboardWidgetData);
    }

    return dashboard;
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.ViewDashboardList]})
  @get('/dashboards', {
    responses: {
      '200': {
        description: 'Array of Dashboard model instances',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(Dashboard, {includeRelations: true}),
          },
        },
      },
    },
  })
  /**
   * The find function retrieves dashboards with their associated widgets based on the provided filter.
   * @param [filter] - The `filter` parameter is an optional parameter of type `Filter<Dashboard>`. It
   * is used to specify the filter conditions for the query. The `Filter` type is a generic type that
   * allows you to define the filter conditions for a specific model. In this case, the `Filter` type
   * @returns an array of Dashboards.
   */
  async find(
    @param.filter(Dashboard) filter?: Filter<Dashboard>,
  ): Promise<DashboardWithWidgets[]> {
    const dashboards = await this.dashboardRepository.find(filter);
    const dashboardIds = dashboards.map(d => d.id);

    // Fetch all related widgets in one go
    const allDashboardWidgets = await this.dashboardWidgetRepository.find({
      where: {dashboardId: {inq: dashboardIds}},
    });

    // Map widget IDs to their respective dashboards
    const dashboardIdToWidgetIdsMap = allDashboardWidgets.reduce(
      (map, dw) => {
        const {dashboardId, widgetId} = dw;
        map[dashboardId] ??= [];
        map[dashboardId].push(widgetId);
        return map;
      },
      {} as Record<string, string[]>,
    );

    // Construct the final result
    const enhancedDashboards = dashboards.map(dashboard => {
      return {
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        layout: dashboard.layout,
        widgetIds: dashboardIdToWidgetIdsMap[dashboard.id] ?? [],
      };
    });

    return enhancedDashboards as DashboardWithWidgets[];
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.ViewDashboardList]})
  @get('/dashboards/count', {
    responses: {
      '200': {
        description: 'Count Dashboard',
        content: {
          'application/json': {
            schema: {type: 'object', properties: {count: {type: 'number'}}},
          },
        },
      },
    },
  })
  /**
   * The count function returns the number of dashboards that match the given filter.
   * @param [filter] - The `filter` parameter is an optional parameter of type `Filter<Dashboard>`. It
   * is used to specify the filtering criteria for the count operation. The `Filter` type is a generic
   * type that allows you to define the filtering criteria for a specific entity type. In this case,
   * the `Filter
   * @returns The count of the number of dashboards that match the provided filter criteria.
   */
  async count(
    @param.filter(Dashboard) filter?: Filter<Dashboard>,
  ): Promise<{count: number}> {
    return this.dashboardRepository.count(filter?.where);
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.ViewDashboard]})
  @get(DASHBOARD_URL, {
    responses: {
      '200': {
        description: 'Dashboard model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRefSF(Dashboard),
          },
        },
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Dashboard> {
    const dashboard = await this.dashboardRepository.findById(id);
    const dashboardWidgets = await this.dashboardWidgetRepository.find({
      where: {dashboardId: id},
    });
    const widgetIds = dashboardWidgets.map(dw => dw.widgetId);
    return {...dashboard, widgetIds} as DashboardWithWidgets;
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.UpdateDashboard]})
  @patch(DASHBOARD_URL, {
    responses: {
      '204': {
        description: 'Dashboard PATCH success',
      },
    },
  })
  /**
   * The function updates a dashboard record in a database by its ID.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * dashboard that needs to be updated. It is extracted from the path of the request URL.
   * @param dashboard - The `dashboard` parameter is of type `Partial<Dashboard>`, which means it is an
   * object that contains a subset of properties from the `Dashboard` model.
   */
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() dashboard: Partial<Dashboard>,
  ): Promise<void> {
    await this.dashboardRepository.updateById(id, dashboard);
  }
  @authenticate(STRATEGY.BEARER, {passReqToCallback: true})
  @authorize({permissions: [PermissionKeys.DeleteDashboard]})
  @del(DASHBOARD_URL, {
    responses: {
      '204': {
        description: 'Dashboard DELETE success',
      },
    },
  })
  /**
   * The function deletes a record from the dashboard repository based on the provided ID.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * item to be deleted.
   */
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.dashboardRepository.deleteById(id);
  }
}
