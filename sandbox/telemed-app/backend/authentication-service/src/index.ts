import { getSecretValue } from './config';
export * from './application';

const PORT = 3000;

export async function main(options: any = {}) {

  const {
      AuthenticationServiceApplication,
    }=require('./application');
  const app = new AuthenticationServiceApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`); // NOSONAR
  console.log(`Try ${url}/ping`); // NOSONAR

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? PORT),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };

  getSecretValue().then(res=>{
    Object.assign(process.env,res);    
    main(config).catch(err => {
      console.error('Cannot start the application.', err); // NOSONAR
      process.exit(1);
    });
  })
  
}
