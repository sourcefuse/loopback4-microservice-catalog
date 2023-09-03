import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  juggler,
  repository,
} from '@loopback/repository';
import {Child, ChildRelations, Sibling} from '../models';
import {Getter, inject} from '@loopback/core';
import {SiblingRepository} from './sibling.repository';

export class ChildRepository extends DefaultCrudRepository<
  Child,
  typeof Child.prototype.id,
  ChildRelations
> {
  public readonly siblingRelations: HasManyRepositoryFactory<
    Sibling,
    typeof Child.prototype.id
  >;
  constructor(
    @inject('datasources.db')
    dataSource: juggler.DataSource,
    @repository.getter('SiblingRepository')
    protected siblingRelationsRepositoryGetter: Getter<SiblingRepository>,
  ) {
    super(Child, dataSource);
    this.siblingRelations = this.createHasManyRepositoryFactoryFor(
      'siblingRelations',
      siblingRelationsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'siblingRelations',
      this.siblingRelations.inclusionResolver,
    );
  }
}
