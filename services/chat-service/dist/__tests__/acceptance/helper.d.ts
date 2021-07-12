import { Client } from '@loopback/testlab';
import { ChatApplication } from '../application';
export declare function setUpApplication(): Promise<AppWithClient>;
export interface AppWithClient {
    app: ChatApplication;
    client: Client;
}
