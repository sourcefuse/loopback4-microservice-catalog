# @sourceloop/workflow-ui

An Angular Client to develop workflows using an intuitive statement based UI.
## Installation

```bash

npm i @sourceloop/workflow-ui

```

## Usage

- Install the workflow-ui
  `npm i @sourceloop/workflow-ui`
- Import the `WorkflowBuilderModule` in the required module -

  ```typescript
    ...
    imports: [
        ...
        WorkflowBuilderModule,
        ...
    ],
  ```

- Use the component selector in your application - 
  ```html
    <workflow-builder
    [(state)]="state"
    [(diagram)]="diagram"
    (eventAdded)="elementClick($event)"
    (actionAdded)="elementClick($event)"
    (itemChanged)="valueChanges($event)"
  ></workflow-builder>
  ```

  - `state` is the initial state object
  - `diagram` is initial BPMN Diagram respectively.
  - `eventAdded` - this event fires whenever a new event is added in the workflow
  - `actionAdded` - this event fires whenever a new action is added in the workflow
  - `itemChange` - this event fires whenever a user input changes

### Configurations
#### Nodes

  - Each Statement is made up of nodes -
    - Events - Triggers or Checks that lead to an action
    - Action - Actually task performed by the workflow
  
  - You can create your own nodes by extending the `WorkflowNode` class.
  - To register this node for use, provide it to the `BPMN_NODES` token -

  ```typescript
  {provide: BPMN_NODES, useValue: CustomNode, multi: true},
  ```

#### Element

  - Each Node is based on certain base elements like tasks, gateways, etc.
  - You can create your own BPMN Elements by extending the `BpmnElement` class.
  - You can also create any custom element by extending the `WorkflowElement` class(in case working with a non-BPMN workflow engine).
  - To register this element for use, provide it to the `BPMN_INPUTS` token - 
  
  ```typescript
  {provide: BPMN_ELEMENTS, useValue: CustomElement, multi: true},
  ```

#### Prompts

  - Each Node also has some prompts or inputs from the users.
  - You can create your own Prompt by extending the `WorkflowPrompt` class.
  - To register this prompt for use, provide it to the token - 
  
  ```typescript
  {provide: BPMN_INPUTS, useValue: CustomInput, multi: true},
  ```


