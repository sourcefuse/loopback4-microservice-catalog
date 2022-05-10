import {
    Binding,
    Component,
    ControllerClass,
    CoreBindings,
    inject,
    ProviderMap,
} from '@loopback/core';
import { Class, Model, Repository } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import {
    CoreComponent,
    SECURITY_SCHEME_SPEC,
    ServiceSequence,
} from '@sourceloop/core';
import {
    RequestServiceBindings
} from './keys';
import {
    ContractController,
    OcrController,
    OcrHooksController
} from './controllers';
import { Contracts, OcrResults, HocrResults } from './models';
import {
    ContractRepository,
    OcrResultRepository,
    HocrResultRepository
} from './repositories';
import { IRequestServiceConfig } from './types';

export class FetchServiceComponent implements Component {
    constructor(
        @inject(CoreBindings.APPLICATION_INSTANCE)
        private readonly application: RestApplication,
        @inject(RequestServiceBindings.Config, { optional: true })
        private readonly requestConfig?: IRequestServiceConfig,
    ) {
        this.bindings = [];
        this.providers = {};

        // Mount core component
        this.application.component(CoreComponent);

        this.application.api({
            openapi: '3.0.0',
            info: {
                title: 'Ocr Service',
                version: '1.0.0',
            },
            paths: {},
            components: {
                securitySchemes: SECURITY_SCHEME_SPEC,
            },
            servers: [{ url: '/' }],
        });


        this.bindings.push(
            Binding.bind(RequestServiceBindings.Config).to({
                baseUrl: process.env.CLM_ML_BASEURL ?? '',
                json: true,
                useRequestProvider: true,
                useCustomSequence: true
            })
        );

        if (!this.requestConfig?.useCustomSequence) {
            // Mount default sequence if needed
            this.setupSequence();
        }

        this.repositories = [
            ContractRepository,
            OcrResultRepository,
            HocrResultRepository
        ];

        this.models = [Contracts, OcrResults, HocrResults];

        this.controllers = [
            ContractController,
            OcrController,
            OcrHooksController
        ];
    }

    providers?: ProviderMap = {};

    bindings?: Binding[] = [];

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
    setupSequence() {
        this.application.sequence(ServiceSequence);
    }
}