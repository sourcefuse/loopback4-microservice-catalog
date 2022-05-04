import {Inject, Injectable} from '@angular/core';
import {
  CreateStrategy,
  ElementInput,
  LinkStrategy,
} from '../../../../interfaces';
import {ElementTypes} from '../../../../enum';
import {BpmnElement, ModdleElement} from '../../../../types/bpmn.types';
import {UtilsService} from '../../../utils.service';
import {CREATE_GATEWAY_STRATEGY} from '../../strategies/create';
import {LINK_GATEWAY_STRATEGY} from '../../strategies/link';

@Injectable()
export class GatewayElement extends BpmnElement {
  constructor(
    @Inject(CREATE_GATEWAY_STRATEGY)
    protected creator: CreateStrategy<ModdleElement>,
    @Inject(LINK_GATEWAY_STRATEGY)
    protected linker: LinkStrategy<ModdleElement>,
    public utils: UtilsService,
  ) {
    super();
  }
  tag = 'bpmn:InclusiveGateway';
  name = 'gateway';
  properties = {};
  statement: string | undefined;
  static type = ElementTypes.Gateway;
  attributes = {
    name: {
      state: 'condition',
    },
  };

  inputs: ElementInput;
  outputs: string;
}
