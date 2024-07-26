import {inject} from '@loopback/core';
import {
  AnyObject,
  Count,
  DefaultCrudRepository,
  repository,
  Where,
} from '@loopback/repository';
import {
  DefaultUserModifyCrudRepository,
  UserModifiableEntity,
} from '@sourceloop/core';
import {ArchivalComponentBindings} from '../keys';
import {ArchiveMapping} from '../models';
import {ArchivalMappingRepository} from '../repositories';
import {
  AbstractConstructor,
  ActorId,
  ArchiveMixinBase,
  ArchiveOption,
  ExportDataExternalSystem,
  IArchiveMixin,
  IBuildWhereConditionService,
  User,
} from '../types';

export function ArchivalRepositoryMixin<
  T extends UserModifiableEntity,
  ID,
  Relations extends object,
  //sonarignore:end
  R extends ArchiveMixinBase<T, ID, Relations>,
>(superClass: R, opts: AnyObject): R & AbstractConstructor<IArchiveMixin> {
  abstract class MixedRepository extends superClass implements IArchiveMixin {
    getRepository: () => Promise<R>;
    getCurrentUser?: () => Promise<User>;
    actorIdKey?: ActorId;
    @inject(ArchivalComponentBindings.EXPORT_ARCHIVE_DATA)
    public export: ExportDataExternalSystem;
    @inject('services.BuildWhereConditionService')
    private buildWhereConditionService: IBuildWhereConditionService;
    @repository(ArchivalMappingRepository)
    public archivalMappingRepo: ArchivalMappingRepository;

    async deleteAll(where?: Where<T>, options?: ArchiveOption): Promise<Count> {
      if (this.getCurrentUser) {
        const user = await this.getCurrentUser();
        const repo =
          (await this.getRepository()) as unknown as DefaultCrudRepository<
            T,
            ID,
            Relations
          >;
        const isSFRepo = repo instanceof DefaultUserModifyCrudRepository;

        //collect the data that needs to be archived
        if (!options?.skipArchive) {
          let entriesToArchive;
          if (isSFRepo) {
            entriesToArchive = await repo.findAll({where});
          } else {
            entriesToArchive = await repo.find({where});
          }
          if (!entriesToArchive.length) {
            return {count: 0};
          }
          //pass this data to the provider to save the data to external system
          const fileName = await this.export(entriesToArchive);
          const model = repo.entityClass.name;

          /** construct the filter to be saved in the archival mapping table
           *  so that the data can be retrieved later on
           */
          const filter =
            await this.buildWhereConditionService.buildConditionForInsert(
              where,
            );

          //save the data in archive mapping table
          const archivalMappig = new ArchiveMapping({
            key: fileName,
            actedOn: model,
            filter,
            actedAt: new Date(),
            actor: this.getActor(user, options?.actorId),
          });
          await this.archivalMappingRepo.create(archivalMappig);
        }

        /** hard delete the data
         * if the repository is of type DefaultUserModifyCrudRepository we need to Hard delete
         * else we can delete the data normally
         */
        if (isSFRepo) {
          return repo.deleteAllHard(where, options);
        } else {
          return repo.deleteAll(where, options);
        }
      }
      return {count: 0};
    }
    getActor(user: User, optionsActorId?: string): string {
      return (
        optionsActorId ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (user[this.actorIdKey ?? 'id'] as any)?.toString() ?? //NOSOAR
        '0'
      );
    }
  }
  return MixedRepository;
}
