import {RecordOfAnyType, CustomBpmnModdle, ModdleElement} from '../types';
import {assign, map, pick} from 'lodash';
import {connectRectangles, is} from './helpers';
import {Point} from './types';
import {Injectable} from '@angular/core';
@Injectable()
export class DiFactoryService {
  constructor(private readonly moddle: CustomBpmnModdle) {}
  create(type: ModdleElement | string, attrs?: RecordOfAnyType) {
    return this.moddle.create(type, attrs ?? {});
  }
  createDiLabel() {
    return this.create('bpmndi:BPMNLabel', {
      bounds: this.createDiBounds(),
    });
  }

  createDiShape(
    semantic: ModdleElement,
    bounds: RecordOfAnyType,
    attrs: RecordOfAnyType,
  ) {
    return this.create(
      'bpmndi:BPMNShape',
      assign(
        {
          bpmnElement: semantic,
          bounds: this.createDiBounds(bounds),
        },
        attrs,
      ),
    );
  }

  createDiBounds(bounds?: RecordOfAnyType) {
    return this.create('dc:Bounds', bounds);
  }

  createDiWaypoints(waypoints?: Array<Point>) {
    return map(waypoints, (pos: Point) => this.createDiWaypoint(pos));
  }

  createDiWaypoint(point: Point) {
    return this.create('dc:Point', pick(point, ['x', 'y']));
  }

  createDiEdge(
    semantic: ModdleElement,
    attrs: RecordOfAnyType,
    waypoints?: Array<Point>,
  ) {
    return this.create(
      'bpmndi:BPMNEdge',
      assign(
        {
          bpmnElement: semantic,
          waypoint: this.createDiWaypoints(waypoints),
        },
        attrs,
      ),
    );
  }

  createDiPlane(attrs: RecordOfAnyType) {
    return this.create('bpmndi:BPMNPlane', {
      bpmnElement: attrs,
    });
  }

  createDiDiagram(attrs: RecordOfAnyType) {
    return this.create('bpmndi:BPMNDiagram', attrs);
  }

  createBpmnElementDi(
    elementType: ModdleElement | string,
    attrs: RecordOfAnyType,
    pos?: RecordOfAnyType,
  ) {
    let di, businessObject;

    attrs = attrs || {};

    if (elementType === 'diagram') {
      di = this.createDiDiagram({
        id: attrs['id'],
      });
    } else if (elementType === 'root') {
      di = this.createDiPlane(attrs);
    } else if (elementType === 'connection') {
      const connection = attrs;
      const targetBounds = connection['get']('targetRef').bounds;
      const sourceBounds = connection['get']('sourceRef').bounds;
      const waypoints = connectRectangles(sourceBounds, targetBounds);

      businessObject = this.create(attrs['$type'], connection);

      di = this.createDiEdge(
        businessObject,
        {
          id: '_BPMNConnection_' + connection['id'],
        },
        waypoints,
      );
    } else {
      const size = this._getDefaultSize(attrs['$type']);
      const bounds = assign({}, pos, size);

      businessObject = this.create(attrs['$type'], attrs);

      di = this.createDiShape(businessObject, bounds, {
        id: '_BPMNShape_' + attrs['id'],
      });
    }
    return di;
  }

  _getDefaultSize(element: ModdleElement | string) {
    if (is(element, 'bpmn:SubProcess')) {
      return {width: 100, height: 80};
    }

    if (is(element, 'bpmn:Task')) {
      return {width: 100, height: 80};
    }

    if (is(element, 'bpmn:Gateway')) {
      return {width: 50, height: 50};
    }

    if (is(element, 'bpmn:StartEvent') || is(element, 'bpmn:EndEvent')) {
      return {width: 36, height: 36};
    }

    if (is(element, 'bpmn:Lane')) {
      return {width: 400, height: 100};
    }

    if (is(element, 'bpmn:DataObjectReference')) {
      return {width: 36, height: 50};
    }

    if (is(element, 'bpmn:DataStoreReference')) {
      return {width: 50, height: 50};
    }

    if (is(element, 'bpmn:TextAnnotation')) {
      return {width: 100, height: 30};
    }

    return {width: 100, height: 80};
  }
}
