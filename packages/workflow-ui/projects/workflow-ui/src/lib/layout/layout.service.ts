import {RecordOfAnyType, CustomBpmnModdle, ModdleElement} from '../types';
import {DiFactoryService} from './di.service';
import {assign} from 'lodash';
import {Point} from './types';
import {getOutgoingConnection, getStartEvent} from './helpers';
import {Injectable} from '@angular/core';
const EMPTY_DI =
  '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
  '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
  '</bpmndi:BPMNPlane>' +
  '</bpmndi:BPMNDiagram>' +
  '</bpmn:definitions>';

const STDDIST = 50;
const CENT = 100;
const MID = 36;
const TWO = 2;
const SEQ_TAG = 'bpmn:SequenceFlow';

@Injectable()
export class AutoLayoutService {
  constructor(
    private readonly moddle: CustomBpmnModdle,
    private readonly DiFactory: DiFactoryService,
  ) {}
  async layoutProcess(xmlStr: string) {
    xmlStr = xmlStr.replace('</bpmn:definitions>', EMPTY_DI);
    const {rootElement} = await this.moddle.fromXML(xmlStr);

    const root = rootElement.get('rootElements')[0];
    const rootDi = rootElement.get('diagrams')[0].get('plane');
    rootDi.$attrs['bpmnElement'] = root.id;

    this.bfs(root, rootDi);

    return this.moddle.toXML(rootElement);
  }

  bfs(parentFlowElement: ModdleElement, parentDi: ModdleElement) {
    const children = parentFlowElement.get('flowElements');

    const startEvent = getStartEvent(children);

    // groups are elements with the same distance
    let group: RecordOfAnyType = {
      elements: [],
      connections: [],
      anchor: {
        x: CENT,
        // CENT + mid of startEvent
        y: CENT + MID / TWO,
      },
      distance: 0,
    };

    startEvent['marked'] = true;
    startEvent['dist'] = 0;

    // queue holds visited elements
    const queue = [startEvent];

    let elementOrConnection: ModdleElement | undefined, outgoings;

    while (queue.length !== 0) {
      // get first
      elementOrConnection = queue.shift();

      // insert element into group
      if (elementOrConnection) {
        group = this.groupElement(elementOrConnection, group, parentDi);
      }

      if (elementOrConnection && elementOrConnection.$type !== SEQ_TAG) {
        // only if source is an element
        outgoings = getOutgoingConnection(elementOrConnection, children);
        const el = elementOrConnection;
        outgoings.forEach((connection: ModdleElement) => {
          this.layoutConnection(el, connection, queue);
        });
      }
    }

    this.layoutGroup(group, parentDi);
  }

  layoutConnection(
    el: ModdleElement,
    connection: ModdleElement,
    queue: ModdleElement[],
  ) {
    if (!connection['marked']) {
      connection['marked'] = true;
      connection['dist'] = el['dist'] + 1;
      queue.push(connection);
    }

    var target = connection['get']('targetRef');
    if (!target['marked']) {
      target['marked'] = true;
      target['dist'] = el['dist'] + 1;
      queue.push(target);
    }
  }

  groupElement(
    elementOrConnection: ModdleElement,
    group: RecordOfAnyType,
    parentDi: ModdleElement,
  ) {
    if (elementOrConnection['dist'] === group['distance']) {
      if (elementOrConnection.$type === SEQ_TAG) {
        group['connections'].push(elementOrConnection);
      } else {
        group['elements'].push(elementOrConnection);
      }
    } else {
      const newAnchor = this.layoutGroup(group, parentDi);
      group = {
        elements:
          elementOrConnection.$type === SEQ_TAG ? [] : [elementOrConnection],
        connections:
          elementOrConnection.$type === SEQ_TAG ? [elementOrConnection] : [],
        anchor: newAnchor,
        distance: elementOrConnection['dist'],
      };
    }
    return group;
  }

  layoutGroup(group: RecordOfAnyType, parentDi: ModdleElement) {
    const newAnchor = this.layoutElements(group, parentDi);

    const connections = group['connections'];

    this.layoutConnections(connections, parentDi);

    return newAnchor;
  }

  layoutElements(group: RecordOfAnyType, parentDi: ModdleElement) {
    const elements = group['elements'],
      anchor = group['anchor'];

    let bottom: number, top: number;

    bottom = top = anchor.y;
    const childrenDi = parentDi.get('planeElement');
    let elementDi;

    const pos: Partial<Point> = {
      x: anchor.x,
    };

    let size, height, width;
    let maxWidth = 0;

    elements.forEach((element: ModdleElement) => {
      size = this.DiFactory._getDefaultSize(element.$type);
      height = size.height;
      maxWidth = Math.max(maxWidth, size.width);

      if (top === bottom) {
        bottom += height / TWO;
        top -= height / TWO;
        pos.y = top;
      } else {
        if (anchor.y - top < bottom - anchor.y) {
          // move to top
          top -= height + STDDIST;
          pos.y = top;
        } else {
          // move to bottom
          bottom += STDDIST + height;
          pos.y = bottom;
        }
      }
      element['bounds'] = assign({}, pos, size);
      elementDi = this.DiFactory.createBpmnElementDi('shape', element, pos);
      childrenDi.push(elementDi);
    });

    return {x: anchor.x + maxWidth + TWO * STDDIST, y: anchor.y};
  }

  layoutConnections(
    connections: Array<RecordOfAnyType>,
    parentDi: ModdleElement,
  ) {
    const childrenDi = parentDi.get('planeElement');
    connections.forEach(connection => {
      const connectionDi = this.DiFactory.createBpmnElementDi(
        'connection',
        connection,
      );
      childrenDi.push(connectionDi);
    });
  }
}
