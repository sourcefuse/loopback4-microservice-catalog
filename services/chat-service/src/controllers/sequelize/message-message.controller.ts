import {repository} from '@loopback/repository';
import {MessageRepository} from '../../repositories/sequelize';
import {MessageMessageController as JugglerMessageMessageController} from '../message-message.controller';

export class MessageMessageController extends JugglerMessageMessageController {
  constructor(
    @repository(MessageRepository)
    protected messageRepository: MessageRepository,
  ) {
    super(messageRepository);
  }
}
