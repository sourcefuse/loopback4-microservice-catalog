import {BindingKey, CoreBindings} from '@loopback/core';
import {BpmnServiceComponent} from './component';
import {BpmnServiceComponentOptions} from './types';

/**
 * Binding keys used by this component.
 */
export namespace BpmnServiceComponentBindings {
  export const COMPONENT = BindingKey.create<BpmnServiceComponent>(
    `${CoreBindings.COMPONENTS}.BpmnServiceComponent`,
  );
}


export namespace BPMNServiceBindings {
  export const BPMNServiceConfig = BindingKey.create<BpmnServiceComponentOptions>(
    'sf.bpmn.config',
  );
}
