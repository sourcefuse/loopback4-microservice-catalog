# Search Library

An Angular module that exports a component that can enable users to search over configured models using the search microservice provided in the sourceloop microservice catalog.

## Installation

First step is to clone the search folder inside the packages folder. Then navigate inside the search folder and run

```
ng build
```

This will create a dist folder then navigate inside the dist folder and then to search-lib and run

```
npm pack
```

This will create a Tar Package which can be installed by running the npm install command as follows

```
npm install path-of-tar/name-of-tar.tgz
```

## Usage

Create a new Application using Angular CLI and import the SearchLibModule and add it to the imports array of the module. Also create a new service that implements the ISearchService interface exported by the search library. This service will be used by the exported component to make API calls whenever needed. You will have to update the providers section of your module with { provide: SEARCH_SERVICE_TOKEN, useExisting: Your_Service_Name }
Your module will then look something like this

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { XComponent } from './x/x.component';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchLibModule, SEARCH_SERVICE_TOKEN} from 'search-lib';
import { SearchService } from './search.service';
@NgModule({
  declarations: [
    AppComponent,
    XComponent
  ],
  imports: [
    BrowserModule,
    SearchLibModule, //import SearchLibModule
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [{ provide: SEARCH_SERVICE_TOKEN, useExisting: SearchService }], //Add your service here
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Search Service

Create a new service using the Angular CLI. This service should implement ISearchService. You will have to implement searchApiRequest method which should return Observable&lt;Array&lt;T&gt;&gt;. Here T refers to the type of data returned from the search microservice. If you are using the default settings for the search microservice you can use IDefaultReturnType interface, else you need to pass your own return type interface.
The type of data recieved by the searchApiRequest method is IRequestParameters

```
interface IRequestParameters {

    match: string,
    source: 'All' | IModel,
    limit: number,
    limitByType: boolean,
    order: string,
    offset: number,
    saveInRecents: boolean

}
```

Source is of type IModel in case the user wants to search a particular category.

```
interface IModel {
    name: string,
    displayName: string
    imageUrl?: string
}
```

Implementing the recentSearchApiRequest method is optional and its implementation depends on if you want recent search functionality as a part of the search suggestions dropdown

### Configuration

You need to provide some configuration for using the search component using its selector - '&lt;sourceloop-search&gt;&lt;/sourceloop-search&gt;'
This can be provided as an Object of Configuration type as input to the component. To do so, create a property/field in your component of type Configuration&lt;IDefaultReturnType&gt; (IDefaultReturnType can be replaced by your own return type interface). In the constructor initialize the Configuration object with the following properties:

- **displayPropertyName (keyof IDefaultReturnType/Your_Return_Type) :** This is one of the properties returned by the search microservice. It is the property whose value will be displayed in the search dropdown.
- **models ( Array&lt;IModel&gt;) :** You need to provide the list of models you used in your search microservice. You also need to provide the displayName for each Model, this will be used in the search dropdown and categorize button dropdown.

Apart from these there are some optional properties that you can give:

- **limit (number) :** The number of results you want to display. Default value is 20.
- **limitByType (boolean) :** Option to put limit on basis of model. Default value is false.
- **order (Array&lt;string&gt;) :** Array of strings that specify the order format for the request sent to search API. Example, you want your results to be sorted on basis of name property first and then description. In this case you can give order = ["name ASC", "description DESC"]. By default order = []
- **offset (number) :** Number of matched results to skip. Default is 0.
- **saveInRecents (boolean) :** Option for saving the search results of the user. Default value is true.
- **categorizeResults (boolean) :** Option for displaying results in search dropdown according to the Model they come from. Default value is true.
- **hideRecentSearch (boolean) :** Option to provide recent search functionality. Default value is false.
- **hideCategorizeButton (boolean) :** Option to hide the categorize button on the right of search dropdown. Default is false.
- **saveInRecentsOnlyOnEnter (boolean) :** Option to save search query in recent searches only when user presses enter key or changes the category he/she is searching on. Default value is false.
- **searchOnlyOnEnter (boolean) :** Option to call API to display search results only when user presses enter key. Default value is false.

Your component might look something like

```
export class XComponent implements OnInit {

  config: Configuration<IDefaultReturnType>

  constructor(private fb: FormBuilder) {

    this.config = new Configuration<IDefaultReturnType>({
      displayPropertyName: 'name',
      models: [
        {
          name: "ToDo",
          displayName: "List",

        },
        {
          name: "User",
          displayName: "Users",
          imageUrl: 'https://picsum.photos/id/1/50'

        },
      ],
      order: [`name ASC`, `description DESC`]

    })
  }

  ngOnInit(): void { }
}
```

Now in your template you can add the search library component selector like

```
<sourceloop-search [config]="config"></sourceloop-search>
```

You can access the value in the search input using [(ngModel)]. You can also listen to clicked and searched events. Clicked is a MouseEvent emitted when user clicks one of the suggested results (including recent search sugestions). Searched event is emitted when request is made to the api when user types, changes catagory or clicks suggestion. Searched event is also fired in case of calls to recent search api. Searched event will always be emitted whenever user clicks suggestion. This is done because the user might want to search again using the dropdown, so relevant suggestions need to be present. The type of value emitted by search event can be

- In case of recent search Array of recent Search request result is emitted
- If api is called when user types event of type KeyboardEvent is emitted
- If api is called when user changes category event of type change is emitted
- If api is called when user clicks suggestion, MouseEvent is emitted

```
<sourceloop-search [config]="config" [(ngModel)]="value" (clicked)="logMouseEvent($event)" (searched)="logEventOrIRecentSearchResultArray($event)" disabled="false"></sourceloop-search>
```
