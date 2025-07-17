import {Getter, inject} from '@loopback/core';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {FeatureValues} from '../../models';
import {FeatureToggleDbName} from '../../types';
import {SequelizeSoftCrudRepository} from 'loopback4-soft-delete/sequelize';
import {SequelizeDataSource} from '@loopback/sequelize';
export class FeatureValuesRepository extends SequelizeSoftCrudRepository<
  FeatureValues,
  typeof FeatureValues.prototype.id
> {
  constructor(
    @inject(`datasources.${FeatureToggleDbName}`)
    dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(FeatureValues, dataSource, getCurrentUser);
  }
}
