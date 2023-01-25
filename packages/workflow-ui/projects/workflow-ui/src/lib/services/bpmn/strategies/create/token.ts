import {InjectionToken} from '@angular/core';
import {CreateStrategy} from '../../../../interfaces';
import {ModdleElement} from '../../../../types';

export const CREATE_TASK_STRATEGY = new InjectionToken<
  CreateStrategy<ModdleElement>
>('workflow.strategy.create.task');

export const CREATE_GATEWAY_STRATEGY = new InjectionToken<
  CreateStrategy<ModdleElement>
>('workflow.strategy.create.gateway');

export const CREATE_BASIC_STRATEGY = new InjectionToken<
  CreateStrategy<ModdleElement>
>('workflow.strategy.create.basic');

export const CREATE_PROPERTIES_STRATEGY = new InjectionToken<
  CreateStrategy<ModdleElement>
>('workflow.strategy.create.properties');

export const CREATE_OR_GATEWAY_STRATEGY = new InjectionToken<
  CreateStrategy<ModdleElement>
>('workflow.strategy.create.orgateway');

export const CREATE_BASIC_INTERVAL_STRATEGY = new InjectionToken<
  CreateStrategy<ModdleElement>
>('workflow.strategy.create.basic.interval');
