/// <reference types="express" />
import { Request } from '@loopback/rest';
/**
 * A simple controller to bounce back http requests
 */
export declare class PingController {
    private readonly req;
    constructor(req: Request);
    ping(): object;
}
