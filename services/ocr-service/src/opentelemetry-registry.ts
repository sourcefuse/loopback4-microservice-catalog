import {JaegerExporter} from '@opentelemetry/exporter-jaeger';
import {NodeTracerProvider} from '@opentelemetry/node';
import {BatchSpanProcessor, ConsoleSpanExporter} from '@opentelemetry/tracing';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';

dotenv.config();
dotenvExt.load({
  schema: '.env.example',
  errorOnMissing: true,
  includeProcessEnv: true,
});

if (!!+(process.env.ENABLE_TRACING ?? 0)) {
  const provider = new NodeTracerProvider();
  const option = {
    serviceName: process.env.SERVICE_NAME ?? '',
    tags: [],
    // You can use the default UDPSender
    host: process.env.OPENTELEMETRY_HOST ?? '',
    port: process.env.OPENTELEMETRY_PORT ? +process.env.OPENTELEMETRY_PORT : 0,
  };
  // Configure span processor to send spans to the exporter
  const exporter = new JaegerExporter(option);
  provider.addSpanProcessor(new BatchSpanProcessor(exporter));
  provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
  provider.register();
}
