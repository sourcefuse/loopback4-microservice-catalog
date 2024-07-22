// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {WorkflowDto} from '../models';

export const MOCK_CAMUNDA = 'https://mock-camunda.api/engine-rest';

export const firstTestBpmn: WorkflowDto = new WorkflowDto({
  name: 'first-bpmn',
  bpmnFile: JSON.stringify(['topic1', 'topic2']),
  description: 'test description',
  inputSchema: {
    type: 'object',
    properties: {valueA: {type: 'string'}, valueB: {type: 'string'}},
    required: ['valueA', 'valueB'],
  },
});

export const firstTestBpmnInput = {
  valueA: 'string',
  valueB: 'string',
};

export const MOCK_WORKFLOW = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" xmlns:modeler="http://camunda.org/schema/modeler/1.0" id="Definitions_04b1851" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.12.0" modeler:executionPlatform="Camunda Platform" modeler:executionPlatformVersion="7.21.0">
  <bpmn:process id="test-workflow" name="test workflow" isExecutable="true" camunda:historyTimeToLive="180">
    <bpmn:extensionElements>
      <camunda:properties>
        <camunda:property />
      </camunda:properties>
    </bpmn:extensionElements>
    <bpmn:startEvent id="Event_1iysr4l" name="Start">
      <bpmn:outgoing>Flow_0g3ljqf</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_0g3ljqf" sourceRef="Event_1iysr4l" targetRef="Activity_0wc2kx4" />
    <bpmn:sequenceFlow id="Flow_1i983ig" sourceRef="Activity_0wc2kx4" targetRef="Activity_1k7efrv" />
    <bpmn:endEvent id="Event_0isgemg" name="End">
      <bpmn:incoming>Flow_1le5efs</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1le5efs" sourceRef="Activity_1k7efrv" targetRef="Event_0isgemg" />
    <bpmn:serviceTask id="Activity_0wc2kx4" name="First" camunda:type="external" camunda:topic="topic1">
      <bpmn:incoming>Flow_0g3ljqf</bpmn:incoming>
      <bpmn:outgoing>Flow_1i983ig</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:serviceTask id="Activity_1k7efrv" name="Second" camunda:type="external" camunda:topic="topic2">
      <bpmn:incoming>Flow_1i983ig</bpmn:incoming>
      <bpmn:outgoing>Flow_1le5efs</bpmn:outgoing>
    </bpmn:serviceTask>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="book-revenue-task">
      <bpmndi:BPMNEdge id="Flow_0g3ljqf_di" bpmnElement="Flow_0g3ljqf">
        <di:waypoint x="188" y="120" />
        <di:waypoint x="240" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1i983ig_di" bpmnElement="Flow_1i983ig">
        <di:waypoint x="340" y="120" />
        <di:waypoint x="400" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1le5efs_di" bpmnElement="Flow_1le5efs">
        <di:waypoint x="500" y="120" />
        <di:waypoint x="562" y="120" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="Event_1iysr4l_di" bpmnElement="Event_1iysr4l">
        <dc:Bounds x="152" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="158" y="145" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0isgemg_di" bpmnElement="Event_0isgemg">
        <dc:Bounds x="562" y="102" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="570" y="145" width="20" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_032t6mb_di" bpmnElement="Activity_0wc2kx4">
        <dc:Bounds x="240" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0cpo0j3_di" bpmnElement="Activity_1k7efrv">
        <dc:Bounds x="400" y="80" width="100" height="80" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

export const firstTestRealBpmn = new WorkflowDto({
  ...firstTestBpmn,
  bpmnFile: MOCK_WORKFLOW,
});

export function generateBpmn(name?: string, processId?: string) {
  processId = processId ?? Math.floor(Math.random() * 1000000).toString();
  return {
    ...firstTestBpmn,
    name: name ?? `process-${processId}`,
    bpmnFile: MOCK_WORKFLOW.replace('test-workflow', `process-${processId}`),
  };
}
