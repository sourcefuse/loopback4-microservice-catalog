import {Inject, Injectable} from '@angular/core';
import {ElementTypes} from '../../../../enum';
import {BpmnElement, ModdleElement} from '../../../../types/bpmn.types';
import {UtilsService} from '../../../utils.service';
import {CREATE_PROPERTIES_STRATEGY} from '../../strategies/create';
import {
  CreateStrategy,
  LinkStrategy,
  ElementInput,
} from '../../../../interfaces';
import {LINK_NONE_STRATEGY} from '../../strategies/link';

@Injectable()
export class ProcessPropertiesElement extends BpmnElement {
  constructor(
    @Inject(CREATE_PROPERTIES_STRATEGY)
    protected creator: CreateStrategy<ModdleElement>,
    @Inject(LINK_NONE_STRATEGY)
    protected linker: LinkStrategy<ModdleElement>,
    public utils: UtilsService,
  ) {
    super();
  }
  tag = 'bpmn:ExtensionElements';
  name = 'extension';
  inputs: ElementInput;
  outputs: string;
  static type = ElementTypes.Extension;
  attributes = {};
}
