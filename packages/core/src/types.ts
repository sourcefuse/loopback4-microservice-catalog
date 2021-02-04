export interface IServiceConfig {
  useCustomSequence: boolean;
}

export interface CoreConfig {
  configObject?: i18n.ConfigurationOptions;
  enableObf?: boolean;
  obfPath?: string;
  openapiSpec?: Record<string, unknown>;
}
