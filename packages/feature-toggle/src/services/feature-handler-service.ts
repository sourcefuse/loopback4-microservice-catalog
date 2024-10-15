import {Getter, extensionPoint, extensions} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {
  FeatureFlagMetadata,
  FeatureHandler,
  HANDLER_EXTENSION_POINT_NAME,
  IAuthUserWithDisabledFeat,
} from '../types';

@extensionPoint(HANDLER_EXTENSION_POINT_NAME)
export class FeatureHandlerService {
  constructor(
    @extensions()
    private readonly getHandlers: Getter<FeatureHandler[]>,
  ) {}

  async findHandler(handlerName: string): Promise<FeatureHandler | undefined> {
    const handlers = await this.getHandlers();
    return handlers.find(h => h.handlerName === handlerName);
  }

  async handle(
    featureMetadata: FeatureFlagMetadata,
    currentUser: IAuthUserWithDisabledFeat,
  ): Promise<boolean> {
    if (featureMetadata.options?.handler) {
      const handler = await this.findHandler(featureMetadata.options?.handler);
      if (handler) {
        return handler.handle(featureMetadata, currentUser);
      } else {
        throw new HttpErrors.InternalServerError('No Handler Found');
      }
    } else {
      return true;
    }
  }
}
