import {InjectionToken} from '@angular/core';
import {LinkStrategy} from '../../../../interfaces';
import {ModdleElement} from '../../../../types';

export const LINK_BASIC_STRATEGY = new InjectionToken<
  LinkStrategy<ModdleElement>
>('workflow.strategy.link.basic');
export const LINK_GATEWAY_STRATEGY = new InjectionToken<
  LinkStrategy<ModdleElement>
>('workflow.strategy.link.gateway');
export const LINK_NONE_STRATEGY = new InjectionToken<
  LinkStrategy<ModdleElement>
>('workflow.strategy.link.none');
export const LINK_OR_GATEWAY_STRATEGY = new InjectionToken<
  LinkStrategy<ModdleElement>
>('workflow.strategy.link.orgateway');
