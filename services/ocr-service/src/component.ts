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
    RequestBindings,
    RequestComponent,
    fetchClient
} from '../../../packages/fetch-client/dist';
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

export class FetchServiceComponent implements Component {
    constructor(
        @inject(CoreBindings.APPLICATION_INSTANCE)
        private readonly application: RestApplication,
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

        // Mount OCR component
        this.application.component(RequestComponent);
        this.bindings.push(
            Binding.bind(RequestBindings.Config).to({
                baseUrl: process.env.CLM_ML_BASEURL ?? '',
                json: true
            }),
            Binding.bind(RequestBindings.FetchProvider).toProvider(
                fetchClient
            ),
        );

        this.setupSequence();

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