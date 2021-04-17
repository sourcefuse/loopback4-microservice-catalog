# workflow-helloworld

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run Camunda Engine

Follow the instructions give [here](https://camunda.com/download/?__hstc=12929896.dc8bf3f8cc10f596867d5bff567aa2ef.1617175361415.1618399229457.1618557454920.22&__hssc=12929896.11.1618557454920&__hsfp=1822594318) to install a local and run a local Camunda Engine.


## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Deploying first process

Use the POST /workflow/ API to create a new workflow. You can find the sample bpmn file [here](/src/bpmn/hello.bpmn). Use an escape tool like [this](https://www.freeformatter.com/json-escape.html#ad-output) to escape the contents of the xml file and send them in the POST call body. The BPMN create call for this sample project would have the following body - 

```
{
  "name": "hello_world",
  "bpmnFile": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<bpmn:definitions xmlns:bpmn=\"http:\/\/www.omg.org\/spec\/BPMN\/20100524\/MODEL\" xmlns:bpmndi=\"http:\/\/www.omg.org\/spec\/BPMN\/20100524\/DI\" xmlns:dc=\"http:\/\/www.omg.org\/spec\/DD\/20100524\/DC\" xmlns:camunda=\"http:\/\/camunda.org\/schema\/1.0\/bpmn\" xmlns:di=\"http:\/\/www.omg.org\/spec\/DD\/20100524\/DI\" id=\"Definitions_0afcpvc\" targetNamespace=\"http:\/\/bpmn.io\/schema\/bpmn\" exporter=\"Camunda Modeler\" exporterVersion=\"4.6.0\">\r\n  <bpmn:process id=\"Process_1x9qza4\" name=\"hello_world\" isExecutable=\"true\">\r\n    <bpmn:startEvent id=\"StartEvent_1\" name=\"start\">\r\n      <bpmn:outgoing>Flow_067gzp3<\/bpmn:outgoing>\r\n    <\/bpmn:startEvent>\r\n    <bpmn:endEvent id=\"Event_1lenuit\" name=\"stop\">\r\n      <bpmn:incoming>Flow_0ikor6l<\/bpmn:incoming>\r\n    <\/bpmn:endEvent>\r\n    <bpmn:sequenceFlow id=\"Flow_067gzp3\" sourceRef=\"StartEvent_1\" targetRef=\"Activity_105yp1n\" \/>\r\n    <bpmn:sequenceFlow id=\"Flow_0ikor6l\" sourceRef=\"Activity_105yp1n\" targetRef=\"Event_1lenuit\" \/>\r\n    <bpmn:serviceTask id=\"Activity_105yp1n\" name=\"Say Hello\" camunda:type=\"external\" camunda:topic=\"hello-task\">\r\n      <bpmn:extensionElements>\r\n        <camunda:inputOutput>\r\n          <camunda:inputParameter name=\"name\">${name}<\/camunda:inputParameter>\r\n        <\/camunda:inputOutput>\r\n      <\/bpmn:extensionElements>\r\n      <bpmn:incoming>Flow_067gzp3<\/bpmn:incoming>\r\n      <bpmn:outgoing>Flow_0ikor6l<\/bpmn:outgoing>\r\n    <\/bpmn:serviceTask>\r\n  <\/bpmn:process>\r\n  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\r\n    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_1x9qza4\">\r\n      <bpmndi:BPMNEdge id=\"Flow_067gzp3_di\" bpmnElement=\"Flow_067gzp3\">\r\n        <di:waypoint x=\"188\" y=\"120\" \/>\r\n        <di:waypoint x=\"290\" y=\"120\" \/>\r\n      <\/bpmndi:BPMNEdge>\r\n      <bpmndi:BPMNEdge id=\"Flow_0ikor6l_di\" bpmnElement=\"Flow_0ikor6l\">\r\n        <di:waypoint x=\"390\" y=\"120\" \/>\r\n        <di:waypoint x=\"482\" y=\"120\" \/>\r\n      <\/bpmndi:BPMNEdge>\r\n      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\r\n        <dc:Bounds x=\"152\" y=\"102\" width=\"36\" height=\"36\" \/>\r\n        <bpmndi:BPMNLabel>\r\n          <dc:Bounds x=\"159\" y=\"145\" width=\"22\" height=\"14\" \/>\r\n        <\/bpmndi:BPMNLabel>\r\n      <\/bpmndi:BPMNShape>\r\n      <bpmndi:BPMNShape id=\"Event_1lenuit_di\" bpmnElement=\"Event_1lenuit\">\r\n        <dc:Bounds x=\"482\" y=\"102\" width=\"36\" height=\"36\" \/>\r\n        <bpmndi:BPMNLabel>\r\n          <dc:Bounds x=\"490\" y=\"145\" width=\"21\" height=\"14\" \/>\r\n        <\/bpmndi:BPMNLabel>\r\n      <\/bpmndi:BPMNShape>\r\n      <bpmndi:BPMNShape id=\"Activity_02i37n5_di\" bpmnElement=\"Activity_105yp1n\">\r\n        <dc:Bounds x=\"290\" y=\"80\" width=\"100\" height=\"80\" \/>\r\n      <\/bpmndi:BPMNShape>\r\n    <\/bpmndi:BPMNPlane>\r\n  <\/bpmndi:BPMNDiagram>\r\n<\/bpmn:definitions>\r\n",
  "inputSchema": {"type":"object"}
}
```

## Executing a workflow

Hit the POST /workflow/{id}/execute API using the ID returned in the above API with the following payload - 

```
{
"input": {"name": "<Your Name>"}
}
```

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
