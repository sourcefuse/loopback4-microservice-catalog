// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {
  SearchServiceBindings,
  SearchServiceComponent,
} from '@sourceloop/search-service';
import {ToDo, User} from './models';
import {SECURITY_SCHEME_SPEC} from '@sourceloop/core';

export {ApplicationConfig};

export class SearchMsExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.api({
      openapi: '3.0.0',
      paths: {},
      info: {
        title: 'Search API Example',
        version: '1.0',
      },
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
    });

    this.bind(SearchServiceBindings.Config).to({
      useCustomSequence: false,
      controller: {
        name: 'Test',
        basePath: '/search',
        authenticate: true,
        authorizations: ['*'],
        recents: true,
        recentCount: 3,
      },
      models: [
        ToDo,
        {
          model: User,
          columns: {
            name: 'username',
            description: 'about',
          },
        },
      ],
    });
    this.component(SearchServiceComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
