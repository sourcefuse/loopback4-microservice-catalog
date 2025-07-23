// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Binding, Component, inject, ProviderMap} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {Strategies} from 'loopback4-authentication';
import {JwtKeys, RevokedToken} from '../../models';
import {PublicKeysRepository, RevokedTokenRepository} from '../../repositories';
import {ILogger, LOGGER} from '../logger-extension';
import {
  BearerVerifierBindings,
  BearerVerifierConfig,
  BearerVerifierType,
} from './keys';
import {FacadesBearerAsymmetricTokenVerifyProvider} from './providers/facades-bearer-asym-token-verify.provider';
import {FacadesBearerTokenVerifyProvider} from './providers/facades-bearer-token-verify.provider';
import {ServicesBearerAsymmetricTokenVerifyProvider} from './providers/services-bearer-asym-token-verifier';
import {ServicesBearerTokenVerifyProvider} from './providers/services-bearer-token-verify.provider';

export class BearerVerifierComponent implements Component {
  constructor(
    @inject(BearerVerifierBindings.Config)
    private readonly config: BearerVerifierConfig,
    @inject(LOGGER.LOGGER_INJECT) public logger: ILogger,
  ) {
    this.providers = {};

    this.models = [RevokedToken, JwtKeys];
    this.repositories = [RevokedTokenRepository, PublicKeysRepository];

    if (this.config && this.config.type === BearerVerifierType.service) {
      this.providers[Strategies.Passport.BEARER_TOKEN_VERIFIER.key] =
        ServicesBearerAsymmetricTokenVerifyProvider;
      if (this.config.useSymmetricEncryption) {
        this.providers[Strategies.Passport.BEARER_TOKEN_VERIFIER.key] =
          ServicesBearerTokenVerifyProvider;
      }
    } else if (this.config && this.config.type === BearerVerifierType.facade) {
      this.providers[Strategies.Passport.BEARER_TOKEN_VERIFIER.key] =
        FacadesBearerAsymmetricTokenVerifyProvider;
      if (this.config.useSymmetricEncryption) {
        this.providers[Strategies.Passport.BEARER_TOKEN_VERIFIER.key] =
          FacadesBearerTokenVerifyProvider;
      }
    } else {
      this.logger.error('Invalid BearerVerifierType specified !');
    }
  }
  providers?: ProviderMap;
  bindings: Binding[] = [];

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
}
