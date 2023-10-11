import {CoreBindings, inject} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {AuthenticationConfig} from 'loopback4-authentication';
import {AuthenticationServiceComponent as JugglerAuthenticationServiceComponent} from './component';
import {AuthServiceBindings, AuthenticationBindings} from './keys';
import {IAuthServiceConfig, IMfaConfig, IOtpConfig} from './types';
import { models, repositories } from './sequelize.index';
import { controllers } from './controllers/sequelize';
export class AuthenticationServiceComponent extends JugglerAuthenticationServiceComponent {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    protected readonly application: RestApplication,
    @inject(AuthServiceBindings.MfaConfig, {optional: true})
    protected readonly mfaConfig: IMfaConfig,
    @inject(AuthServiceBindings.OtpConfig, {optional: true})
    protected readonly otpConfig: IOtpConfig,
    @inject(AuthServiceBindings.Config, {optional: true})
    protected readonly authConfig?: IAuthServiceConfig,
    @inject(AuthenticationBindings.CONFIG, {optional: true})
    protected readonly config?: AuthenticationConfig,
  ) {
    super(application, mfaConfig, otpConfig, authConfig, config);
    this.repositories = repositories;

    this.models = models;

    this.controllers = controllers;
  }
}
