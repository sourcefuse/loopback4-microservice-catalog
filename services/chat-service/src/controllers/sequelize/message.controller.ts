import {repository} from '@loopback/repository';
import {MessageRepository} from '../../repositories/sequelize';
import {MessageController as JugglerMessageController} from '../message.controller';
export class MessageController extends JugglerMessageController {
  constructor(
    @repository(MessageRepository)
    public messageRepository: MessageRepository,
  ) {
    super(messageRepository);
  }
}
