import {repository} from '@loopback/repository';
import {MessageRecipientRepository} from '../../repositories/sequelize';
import {MessageRecipientController as JugglerMessageRecipientController} from '../message-recipient.controller';

export class MessageRecipientController extends JugglerMessageRecipientController {
  constructor(
    @repository(MessageRecipientRepository)
    public messageRecipientRepository: MessageRecipientRepository,
  ) {
    super(messageRecipientRepository);
  }
}
