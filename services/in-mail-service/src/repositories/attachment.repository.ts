import {BelongsToAccessor, juggler} from '@loopback/repository';
import {Attachment, Message} from '../models';
import {inject, Getter} from '@loopback/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {
  IAuthUserWithPermissions,
  DefaultUserModifyCrudRepository,
} from '@sourceloop/core';

export class AttachmentRepository extends DefaultUserModifyCrudRepository<
  Attachment,
  typeof Attachment.prototype.id
> {
  public readonly message: BelongsToAccessor<
    Message,
    typeof Attachment.prototype.id
  >;

  constructor(
    @inject('datasources.inmail') dataSource: juggler.DataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    protected readonly getCurrentUser: Getter<
      IAuthUserWithPermissions | undefined
    >,
  ) {
    super(Attachment, dataSource, getCurrentUser);
  }
}
