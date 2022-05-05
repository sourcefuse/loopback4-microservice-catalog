import { Binding, Component, ControllerClass, ProviderMap } from '@loopback/core';
import { Class, Model, Repository } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
export declare class FetchServiceComponent implements Component {
    private readonly application;
    constructor(application: RestApplication);
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
