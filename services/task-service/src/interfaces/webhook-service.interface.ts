import {DataObject} from '@loopback/repository';
import {MessageDTO} from '../models';

export interface WebhookServiceInterface {
  addToSubscription(url: string, key: string): Promise<void>;
  getUrlOfSubscritption(key: string): Promise<string | null>;
  triggerWebhook(key: string, data: DataObject<MessageDTO>): Promise<void>;
}
