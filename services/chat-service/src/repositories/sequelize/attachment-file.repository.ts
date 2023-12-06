import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, repository} from '@loopback/repository';
import {SequelizeDataSource} from '@loopback/sequelize';
import {IAuthUserWithPermissions} from '@sourceloop/core';
import {SequelizeUserModifyCrudRepository} from '@sourceloop/core/sequelize';
import {AuthenticationBindings} from 'loopback4-authentication';
import {MessageRepository} from '.';
import {Message} from '../../models';
import {
  AttachmentFile,
  AttachmentFileRelations,
} from '../../models/attachment-file.model';
export class AttachmentFileRepository extends SequelizeUserModifyCrudRepository<
  AttachmentFile,
  typeof AttachmentFile.prototype.id,
  AttachmentFileRelations
> {
  public readonly message: BelongsToAccessor<
    Message,
    typeof AttachmentFile.prototype.id
  >;
  constructor(
    @inject('datasources.chatDb') dataSource: SequelizeDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
    @repository.getter('MessageRepository')
    protected messageRepositoryGetter: Getter<MessageRepository>,
  ) {
    super(AttachmentFile, dataSource, getCurrentUser);

    this.message = this.createBelongsToAccessorFor(
      'message',
      messageRepositoryGetter,
    );
    this.registerInclusionResolver('message', this.message.inclusionResolver);
  }
}
