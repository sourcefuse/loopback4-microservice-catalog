import {repository} from '@loopback/repository';
import {AttachmentFileRepository} from '../../repositories/sequelize';
import {AttachmentFileController as JugglerAttachmentFileController} from '../message-attachment-file.controller';
export class AttachmentFileController extends JugglerAttachmentFileController {
  constructor(
    @repository(AttachmentFileRepository)
    public attachmentFileRepository: AttachmentFileRepository,
  ) {
    super(attachmentFileRepository);
  }
}
