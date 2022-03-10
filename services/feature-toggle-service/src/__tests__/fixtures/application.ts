// import {BootMixin} from '@loopback/boot';
// import {ApplicationConfig} from '@loopback/core';
// import {
//   RestExplorerBindings,
//   RestExplorerComponent,
// } from '@loopback/rest-explorer';
// import {RepositoryMixin} from '@loopback/repository';
// import {RestApplication} from '@loopback/rest';
// import {ServiceMixin} from '@loopback/service-proxy';
// import path from 'path';
// import {FeatureToggleServiceComponent} from '../../component';
// import {UNLEASH_CONST} from '../../keys';
// const unleash = require('unleash-client');
// export {ApplicationConfig};
// require('dotenv').config();

// export class TestingApplication extends BootMixin(
//   ServiceMixin(RepositoryMixin(RestApplication)),
// ) {
//   constructor(options: ApplicationConfig = {}) {
//     super(options);

//     // Set up default home page
//     this.static('/', path.join(__dirname, '../public'));

//     // Customize @loopback/rest-explorer configuration here
//     this.configure(RestExplorerBindings.COMPONENT).to({
//       path: '/explorer',
//     });
//     this.component(RestExplorerComponent);
//     this.component(FeatureToggleServiceComponent);
//     unleash.initialize({
//       url: 'https://app.unleash-hosted.com/demo/api/',
//       appName: 'my-node-name',
//       environment: 'development',
//       customHeaders: {
//         Authorization: '56907a2fa53c1d16101d509a10b78e36190b0f918d9f122d',
//       },
//     });
//     this.bind(UNLEASH_CONST).to(unleash);

//     this.projectRoot = __dirname;
//     // Customize @loopback/boot Booter Conventions here
//     this.bootOptions = {
//       controllers: {
//         // Customize ControllerBooter Conventions here
//         dirs: ['controllers'],
//         extensions: ['.controller.js'],
//         nested: true,
//       },
//     };
//   }
// }
