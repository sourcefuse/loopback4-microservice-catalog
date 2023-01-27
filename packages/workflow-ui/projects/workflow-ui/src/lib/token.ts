import {InjectionToken} from '@angular/core';
import {ENV} from './types';

/**
 * Creating a new InjectionToken with the name 'env' and the type ENV
 * Required to pass environment variable to library
 * envIdentifier - required to identify enviroment i-e dev/qa
 */
export const ENV_TOKEN = new InjectionToken<ENV>('env');
