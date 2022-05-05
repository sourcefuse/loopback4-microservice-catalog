import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { HocrObject, HocrObjectRelations } from '../models';
export declare class HocrObjectRepository extends DefaultCrudRepository<HocrObject, typeof HocrObject.prototype.id, HocrObjectRelations> {
    constructor(dataSource: juggler.DataSource);
}
