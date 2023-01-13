import {Injectable} from '@angular/core';
import {WorkflowElement, StatementNode} from '../../../../classes';
import {CreateStrategy} from '../../../../interfaces';
import {
  CustomBpmnModdle,
  ModdleElement,
  RecordOfAnyType,
} from '../../../../types';
import {UtilsService} from '../../../utils.service';

@Injectable()
export class CreatePropertyStrategy implements CreateStrategy<ModdleElement> {
  constructor(
    private readonly moddle: CustomBpmnModdle,
    private readonly utils: UtilsService,
  ) {}
  execute(
    element: WorkflowElement<ModdleElement>,
    node: StatementNode<ModdleElement>,
    attrs: RecordOfAnyType,
  ) {
    const properties: ModdleElement[] = [];
    const propertyMap = attrs['state'];
    delete attrs['state'];
    Object.keys(propertyMap).forEach(id => {
      Object.keys(propertyMap[id]).forEach(key => {
        let value;
        if (typeof propertyMap[id][key] === 'object') {
          value = JSON.stringify(propertyMap[id][key]);
        } else {
          value = propertyMap[id][key];
        }
        properties.push(
          this.moddle.create('camunda:Property', {
            name: `${id}_${key}`,
            value,
          }),
        );
      });
    });
    const property = this.moddle.create('camunda:Properties', {
      values: properties,
    });
    return this.moddle.create(element.tag, {
      id: element.id,
      values: [property],
    });
  }
}
