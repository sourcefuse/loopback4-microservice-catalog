import {BindingKey} from '@loopback/context';
import {ILogger} from './logger.interface';
import {BINDING_PREFIX} from '../../constants';

export namespace LOGGER {
  /**
   * Injection key constant
   */
  export const LOGGER_INJECT = `${BINDING_PREFIX}.log.action`;

  /**
   * Binding keys used by this component.
   */
  export namespace BINDINGS {
    export const LOG_ACTION = BindingKey.create<ILogger>(LOGGER_INJECT);
  }

  /**
   * Enum to define the supported log levels
   */
  /* eslint-disable-next-line  @typescript-eslint/naming-convention */
  export enum LOG_LEVEL {
    DEBUG,
    INFO,
    WARN,
    ERROR,
    OFF,
  }
}
