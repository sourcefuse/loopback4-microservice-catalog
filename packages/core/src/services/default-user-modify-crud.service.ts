import {BindingScope, inject, injectable} from '@loopback/core';
import {DataObject, Where} from '@loopback/repository';
import {SFCoreBindings} from '../keys';
import {UserModifiableEntity} from '../models';
import {CoreConfig, IDefaultUserModifyCrud} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class DefaultUserModifyCrudService<T extends UserModifiableEntity, ID>
  implements IDefaultUserModifyCrud<T, ID>
{
  constructor(
    @inject(SFCoreBindings.config, {optional: true})
    private readonly coreConfig: CoreConfig,
  ) {}
  create(data: DataObject<T>): Promise<DataObject<T>> {
    if (this.coreConfig?.restrictDateModification) {
      return this.removeDateFields(data);
    }
    return Promise.resolve(data);
  }
  createAll(data: DataObject<T>[]): Promise<DataObject<T>[]> {
    if (this.coreConfig?.restrictDateModification) {
      data.forEach(d => {
        delete d.createdOn;
        delete d.modifiedOn;
      });
    }
    return Promise.resolve(data);
  }
  save(entity: T): Promise<T> {
    if (this.coreConfig?.restrictDateModification) {
      return this.removeDateFields(entity);
    }
    return Promise.resolve(entity);
  }
  update(data: T): Promise<T> {
    if (this.coreConfig?.restrictDateModification) {
      return this.removeDateFields(data);
    }
    return Promise.resolve(data);
  }

  updateAll(
    data: DataObject<T>,
    where?: Where<T>,
  ): Promise<{data: DataObject<T>; where: Where<T>}> {
    if (this.coreConfig?.restrictDateModification) {
      return this.removeDateFields(data).then(d => ({
        data: d,
        where: where ?? ({} as Where<T>),
      }));
    }
    return Promise.resolve({data, where: where ?? ({} as Where<T>)});
  }
  updateById(id: ID, data: DataObject<T>): Promise<DataObject<T>> {
    if (this.coreConfig?.restrictDateModification) {
      return this.removeDateFields(data);
    }
    return Promise.resolve(data);
  }
  replaceById(id: ID, data: DataObject<T>): Promise<DataObject<T>> {
    if (this.coreConfig?.restrictDateModification) {
      return this.removeDateFields(data);
    }
    return Promise.resolve(data);
  }

  private async removeDateFields<S extends DataObject<T> | T>(
    data: S,
  ): Promise<S> {
    delete data.createdOn;
    delete data.modifiedOn;
    return data;
  }
}
