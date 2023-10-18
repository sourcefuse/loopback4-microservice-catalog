import {repository} from '@loopback/repository';
import {MessageRepository} from '../../repositories/sequelize';
import {MessageMessageRecipientController as JugglerMessageMessageRecipientController} from '../message-message-recipient.controller';
export class MessageMessageRecipientController extends JugglerMessageMessageRecipientController {
  constructor(
    @repository(MessageRepository)
    protected messageRepository: MessageRepository,
  ) {
    super(messageRepository);
  }
}
