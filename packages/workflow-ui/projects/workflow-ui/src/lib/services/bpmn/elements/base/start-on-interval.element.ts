import {Inject, Injectable} from '@angular/core';
import {BpmnElement, ModdleElement} from '../../../../types/bpmn.types';
import {UtilsService} from '../../../utils.service';
import {CREATE_BASIC_INTERVAL_STRATEGY} from '../../strategies/create';
import {
  CreateStrategy,
  LinkStrategy,
  ElementInput,
} from '../../../../interfaces';
import {LINK_BASIC_STRATEGY} from '../../strategies/link/token';

@Injectable()
export class StartOnIntervalElement extends BpmnElement {
  constructor(
    @Inject(CREATE_BASIC_INTERVAL_STRATEGY)
    protected creator: CreateStrategy<ModdleElement>,
    @Inject(LINK_BASIC_STRATEGY)
    protected linker: LinkStrategy<ModdleElement>,
    public utils: UtilsService,
  ) {
    super();
    this.id = `Start_${utils.uuid()}`;
  }
  tag = 'bpmn:StartEvent';
  attributes = {};
  name = 'start';
  inputs: ElementInput;
  outputs: string;
}
