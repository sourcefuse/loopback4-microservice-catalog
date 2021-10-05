import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import {LambdaServiceApplication} from './index';
import {createServer, proxy} from 'aws-serverless-express';
import {Server} from 'http';

let instance: Server;
const binaryMimeTypes = [
  'application/octet-stream',
  'font/eot',
  'font/opentype',
  'font/otf',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
];

async function bootstrap(url: string) {
  if (!instance) {
    const app = new LambdaServiceApplication({
      url: `/${url}/`,
    });
    instance = createServer(
      app.restServer.requestHandler,
      undefined,
      binaryMimeTypes,
    );
    await app.boot();
  }
  return instance;
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
) => {
  const server = await bootstrap(event.requestContext.stage);
  return proxy(server, event, context, 'PROMISE').promise;
};
