import { Binding, Component, ControllerClass, ProviderMap } from '@loopback/core';
import { RestApplication } from '@loopback/rest';
import { IChatServiceConfig } from './types';
import { Class, Model, Repository } from '@loopback/repository';
export declare class ChatServiceComponent implements Component {
    private readonly application;
    private readonly chatConfig?;
    constructor(application: RestApplication, chatConfig?: IChatServiceConfig | undefined);
    providers?: ProviderMap;
    bindings?: Binding[];
    /**
     * An optional list of Repository classes to bind for dependency injection
     * via `app.repository()` API.
     */
    repositories?: Class<Repository<Model>>[];
    /**
     * An optional list of Model classes to bind for dependency injection
     * via `app.model()` API.
     */
    models?: Class<Model>[];
    /**
     * An array of controller classes
     */
    controllers?: ControllerClass[];
    /**
     * Setup ServiceSequence by default if no other sequnce provided
     *
     */
    setupSequence(): void;
}
