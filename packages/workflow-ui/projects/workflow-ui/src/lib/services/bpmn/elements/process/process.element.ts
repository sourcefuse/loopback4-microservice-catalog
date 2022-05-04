import {Inject, Injectable} from '@angular/core';
import {ElementTypes} from '../../../../enum';
import {BpmnElement, ModdleElement} from '../../../../types/bpmn.types';
import {UtilsService} from '../../../utils.service';
import {CREATE_BASIC_STRATEGY} from '../../strategies/create';
import {
  CreateStrategy,
  LinkStrategy,
  ElementInput,
} from '../../../../interfaces';
import {LINK_BASIC_STRATEGY} from '../../strategies/link';

@Injectable()
export class ProcessElement extends BpmnElement {
  constructor(
    @Inject(CREATE_BASIC_STRATEGY)
    protected creator: CreateStrategy<ModdleElement>,
    @Inject(LINK_BASIC_STRATEGY)
    protected linker: LinkStrategy<ModdleElement>,
    public utils: UtilsService,
  ) {
    super();
    this.id = `Process_${utils.uuid()}`;
  }
  tag = 'bpmn:Process';
  name = 'process';
  inputs: ElementInput;
  outputs: string;
  static type = ElementTypes.Process;
  attributes = {
    isExecutable: true,
  };
}
