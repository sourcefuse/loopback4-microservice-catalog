import {Injectable} from '@angular/core';
import {UtilsService} from '../../../utils.service';
import {CreateStrategy} from '../../../../interfaces';
import {
  BpmnStatementNode,
  CustomBpmnModdle,
  ModdleElement,
  RecordOfAnyType,
} from '../../../../types';
import {WorkflowElement} from '../../../../classes';

@Injectable()
export class CreateBasicStrategy implements CreateStrategy<ModdleElement> {
  constructor(
    private readonly moddle: CustomBpmnModdle,
    private readonly utils: UtilsService,
  ) {}
  execute(
    element: WorkflowElement<ModdleElement>,
    node: BpmnStatementNode,
    attrs: RecordOfAnyType,
  ): ModdleElement {
    element.id = `${element.constructor.name}_${this.utils.uuid()}`;
    return this.moddle.create(element.tag, {
      id: element.id,
      name: element.name,
      ...attrs,
    });
  }
}
