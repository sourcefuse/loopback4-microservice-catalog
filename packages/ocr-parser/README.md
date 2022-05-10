# Ocr Parser

## OverView

An Angular module that exports a component that extract the contract clauses and details from a pdf/word document. User can select the particular clause in the UI and the text of the selected clause will be highlight in the html view. User can also update the selected clause by select the new text in the html document then tooltip will be visible over the highlighted text with Update string. User can able to click on tooltip to update the selected clause value.

## Installation

```sh
npm i @sourceloop/ocr-parser
```

## Usage

Create a new Application using Angular CLI and import the OcrParserModule and add it to the imports array of the @NgModule decorator.
Make sure you fulfil all the peer dependencies ( you can check the package.json file in ocr-parser-lib folder for the same)

```ts
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';

import {HttpClientModule} from '@angular/common/http';
import {XComponent} from './x/x.component';
import {ReactiveFormsModule} from '@angular/forms';
import {OcrParserModule} from 'ocr-parser-lib';

@NgModule({
  declarations: [AppComponent, XComponent],
  imports: [
    BrowserModule,
    OcrParserModule, //import OcrParserModule
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Configuration

You can use ocr parser component using its selector - &lt;sourceloop-ocr-parser&gt;&lt;/sourceloop-ocr-parser&gt;

You need to provide some configuration for using the ocr parcer component. It will accept DocumentConfig and FieldConfig array as Input like 
&lt;sourceloop-ocr-parser [documentConfig] = "documentConfig" [fieldConfig] = "fieldConfig" &gt;&lt;/sourceloop-ocr-parser&gt;

In Typescript file you need to define the class properties documentConfig and fieldconfig like

```
documentConfig: DocumentConfig[] = [];
fieldConfig: FieldConfig[] = [];
```
DocumentConfig class is used for document view like html and image view. the DocumentConfig is as follows.

```
export class DocumentConfig {
    docType ?: string;
    tabName ?: string;
    document ?: string[] | undefined;
    constructor(data ?: DocumentConfig) {
        this.docType = data?.docType;
        this.tabName = data?.tabName;
        this.document = data?.document
    }
}
```
Description for various things is as follows:

- **docType**: Type of the document.
- **tabName**: Name of the Tab
- **document**: Array of multiple html pages


FieldConfig class contains the data of different types of clauses. the FieldConfig is as follows.

```
export class FieldConfig {
    tabName?: string;
    fieldData?: FieldData[];

    constructor(data ?: FieldConfig) {
        this.tabName = data?.tabName;
        this.fieldData = data?.fieldData?.map(resp => new FieldData(resp))
    }
}

```
Description for various things is as follows:

- **tabName**: Name of the tab
- **fieldData**: It is the array of multple clauses 

FieldData is as follows.

```
export class FieldData {
    isSelected: boolean;
    label?: string;
    pageNum?: number;
    score: number;
    value?: string;
    color: string;
    id?: string;
    previousValue: string;
    tabName?: string
    coordinates?: {x: number, y: number, height: number, width: number}

    constructor(data? : FieldData) {
        this.isSelected = data?.isSelected || false;
        this.label = data?.label;
        this.pageNum = data?.pageNum;
        this.score = data?.score || 0;
        this.value = data?.value || '';
        this.coordinates = data?.coordinates;
        this.color = data?.color || '';
        this.id = data?.id;
        this.previousValue = data?.previousValue || '';
        this.tabName = data?.tabName;
    }

}
```
Description for various things is as follows:

- **isSelected**: When user select the clause then it will be true and by default it will be false.
- **label**: Name of clause label.
- **pageNum**: Define on which page the clause value is present in document view.
- **score**: Define the confidence score of clause.
- **value**: Value of the clause.
- **coordinates**: Define the boundary box of clause in document view.
- **color**: Define the color of the confidence Score.
- **id**: Unique ID of the each clause.
- **previousValue**: It is the initial value of the clause. This property is used for reset the updated value of clause.
- **tabName**: Name of the tab

You can also get the selected clause and updated clauses by listen the event updatedClauseEvent in the template.

``` <sourceloop-ocr-parser [documentConfig] = "documentConfig" [fieldConfig] = "fieldConfig" (updatedClauseEvent)="onApproveClauseData($event)"></sourceloop-ocr-parser>```

For load the library assets in your application you will need to update assets array in angular.json file like.

```{
    "glob": "**/*",
    "input": "./node_modules/@sourceloop/ocr-parser/assets",
    "output": "./assets/"
  }
```