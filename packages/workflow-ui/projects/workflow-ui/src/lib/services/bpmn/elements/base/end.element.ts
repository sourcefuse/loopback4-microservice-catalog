import {Inject, Injectable} from '@angular/core';
import {BpmnElement, ModdleElement} from '../../../../types/bpmn.types';
import {UtilsService} from '../../../utils.service';
import {CREATE_BASIC_STRATEGY} from '../../strategies/create';
import {LINK_BASIC_STRATEGY} from '../../strategies/link/token';
import {
  CreateStrategy,
  ElementInput,
  LinkStrategy,
} from '../../../../interfaces';

@Injectable()
export class EndElement extends BpmnElement {
  constructor(
    @Inject(CREATE_BASIC_STRATEGY)
    protected creator: CreateStrategy<ModdleElement>,
    @Inject(LINK_BASIC_STRATEGY)
    protected linker: LinkStrategy<ModdleElement>,
    public utils: UtilsService,
  ) {
    super();
    this.id = `End_${utils.uuid()}`;
  }
  tag = 'bpmn:EndEvent';
  attributes = {};
  name = 'end';
  inputs: ElementInput;
  outputs: string;
  statement: string | undefined;
}
