import {Constructor} from '@loopback/context';
import {Entity, PropertyDefinition} from '@loopback/repository';
import {IncomingMessage} from 'http';
import {RelationsMap} from './providers';

export interface IServiceConfig {
  useCustomSequence: boolean;
}

export type ModelConstructor<T extends Entity> = Constructor<T> & {
  definition: {
    properties: {
      [property: string]: PropertyDefinition;
    };
    relations: RelationsMap;
  };
  modelName: string;
};

export type ModelProperties<T extends Entity> = keyof Partial<
  Omit<T, 'toJSON' | 'toObject' | 'getId' | 'getIdObject'>
>;
export interface CoreConfig {
  configObject?: i18n.ConfigurationOptions;
  enableObf?: boolean;
  obfPath?: string;
  openapiSpec?: Record<string, unknown>;
  authentication?: boolean;
  swaggerUsername?: string;
  swaggerPassword?: string;
  swaggerAuthenticate?: (
    req?: IncomingMessage,
    username?: string,
    password?: string,
  ) => boolean;
}
