import * as http from 'http';
import request from 'supertest';
import {AuthenticationServiceApplication} from '../..';
import {STATUS_CODE} from '../../enums/status-codes.enum';
import {setupApplication} from './test-helper';

describe('HomePage', () => {
  let app: AuthenticationServiceApplication;
  let server: http.Server;

  before('setupApplication', async () => {
    ({app} = await setupApplication());
    server = http.createServer(
      (req: http.IncomingMessage, res: http.ServerResponse) => {
        app.requestHandler(req, res);
      },
    );
    process.argv.forEach(argument => console.log(argument)); // NOSONAR
  });

  after(async () => {
    await app.stop();
  });

  it('exposes a default home page', async () => {
    await request(server)
      .get('/')
      .expect(STATUS_CODE.OK)
      .expect('Content-Type', /text\/html/);
  });

  it('exposes self-hosted explorer', async () => {
    await request(server)
      .get('/explorer/')
      .expect(STATUS_CODE.OK)
      .expect('Content-Type', /text\/html/)
      .expect(/<title>LoopBack API Explorer/);
  });
});
