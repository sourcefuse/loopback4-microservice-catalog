
import {BootMixin} from "@loopback/boot";
import {ApplicationConfig, BindingScope} from "@loopback/core";
import {RepositoryMixin} from "@loopback/repository";
import {RestApplication} from "@loopback/rest";
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from "@loopback/rest-explorer";
import {SQSConnector} from './providers/sqs.provider'
import {ServiceMixin} from "@loopback/service-proxy";
import {TaskServiceComponent, TaskServiceBindings} from "@sourceloop/task-service";

import path from "path";
import {MySequence} from "./sequence";

export {ApplicationConfig};

export class TaskServiceUserApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication))
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static("/", path.join(__dirname, "../public"));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: "/explorer",
    });
    this.component(RestExplorerComponent);

    // Add the component
    this.component(TaskServiceComponent);


    this.bind('config').to({
      accessKeyId: process.env.AWS_SQS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SQS_SECRET_KEY,
      region: process.env.AWS_SQS_REGION,
      queueUrl: process.env.AWS_QUEUE_URL,
    });

    this.bind('name').to('myConn');

    this.bind(TaskServiceBindings.TASK_PROVIDER).toProvider(
      SQSConnector
    );


    // this.bind(TaskServiceBindings.TASK_PROVIDER).toProvider(SQSConnector);
    // this.bind('event-queue.connector').toProvider(SQSConnector)

    // Bind the event queue service and SQS connector
    // this.bind('services.EventQueueService').toClass(EventQueueService);
    // this.bind('config').to({
    //   accessKeyId: process.env.AWS_SQS_ACCESS_KEY,
    //   secretAccessKey: process.env.AWS_SQS_SECRET_KEY,
    //   region: process.env.AWS_SQS_REGION,
    //   queueUrl: process.env.AWS_SQS_URL,
    // });

    // this.bind('providers.SQSConnector').toClass(SQSConnector);

    // Bind the custom event queue service and SQS connector

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ["controllers"],
        extensions: [".controller.js"],
        nested: true,
      },
    };
  }
}
