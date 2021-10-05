import { Binding, Component, ControllerClass, ProviderMap } from '@loopback/core';
import { Class, Model, Repository } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { SearchServiceConfig } from './types';
export declare class SearchServiceComponent implements Component {
    private readonly application;
    private readonly config;
    constructor(application: RestApplication, config: SearchServiceConfig);
    providers: ProviderMap;
    bindings: Binding[];
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
     * @param bindings Binding array
     */
    setupSequence(): void;
    createResultModel(base: typeof Model, models: string[]): typeof Model;
}
