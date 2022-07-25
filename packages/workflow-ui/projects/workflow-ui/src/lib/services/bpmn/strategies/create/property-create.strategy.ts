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
  /**
   * It takes the `state` attribute from the `StatementNode` and creates a `camunda:Property` for each
   * key/value pair in the `state` object
   * @param element - WorkflowElement<ModdleElement>
   * @param node - The node that is being executed.
   * @param {RecordOfAnyType} attrs - The attributes of the node.
   * @returns The element that is being returned is a camunda:Properties element.
   */
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
            value: propertyMap[id][key],
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
