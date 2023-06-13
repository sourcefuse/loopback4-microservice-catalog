import {Getter, extensionPoint, extensions} from '@loopback/core';
import {FeatureHandler, HANDLER_EXTENSION_POINT_NAME} from '../types';
import {HttpErrors} from '@loopback/rest';

@extensionPoint(HANDLER_EXTENSION_POINT_NAME)
export class FeatureHandlerService {
  constructor(
    @extensions()
    private getHandlers: Getter<FeatureHandler[]>,
  ) {}

  async findHandler(handlerName: string): Promise<FeatureHandler | undefined> {
    const handlers = await this.getHandlers();
    return handlers.find(h => h.handlerName === handlerName);
  }

  async handle(handlerName: string): Promise<void> {
    const handler = await this.findHandler(handlerName);
    if (handler) {
      return handler.handle();
    } else {
      throw new HttpErrors.InternalServerError('No Handler Found');
    }
  }
}
