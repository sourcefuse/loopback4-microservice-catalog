import {repository} from '@loopback/repository';
import {MessageRecipientRepository} from '../../repositories/sequelize';
import {MessageRecipientMessageController as JugglerMessageRecipientMessageController} from '../message-recipient-message.controller';
export class MessageRecipientMessageController extends JugglerMessageRecipientMessageController {
  constructor(
    @repository(MessageRecipientRepository)
    public messageRecipientRepository: MessageRecipientRepository,
  ) {
    super(messageRecipientRepository);
  }
}
