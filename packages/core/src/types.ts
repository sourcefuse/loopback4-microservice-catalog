import {IncomingMessage} from 'http';

export interface IServiceConfig {
  useCustomSequence: boolean;
}

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
