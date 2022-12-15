import {Injectable} from '@angular/core';
import {JSON_COLUMNS} from '../../../../const';
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
        properties.push(
          this.moddle.create('camunda:Property', {
            name: `${id}_${key}`,
            value:
              (propertyMap[id].value || propertyMap[id].email) &&
              (!propertyMap[id].columnName ||
                JSON_COLUMNS.includes(
                  propertyMap[id].columnName?.toLowerCase(),
                ) ||
                propertyMap[id][key]?.displayValue === 'email') &&
              typeof propertyMap[id][key] === 'object'
                ? JSON.stringify(propertyMap[id][key])
                : propertyMap[id][key],
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
