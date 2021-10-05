import { DefaultCrudRepository } from '@loopback/repository';
import { ToDo } from '../models';
import { DynamicDataSource } from '../datasources';
export declare class ToDoRepository extends DefaultCrudRepository<ToDo, typeof ToDo.prototype.id> {
    constructor(dataSource: DynamicDataSource);
}
