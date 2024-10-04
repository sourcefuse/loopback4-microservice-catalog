import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  post,
  requestBody,
  RequestContext,
  RestBindings,
} from '@loopback/rest';
import {STATUS_CODE} from '@sourceloop/core';
import ejs from 'ejs';
import {UserRepository} from '../repositories/user.repository';

import OidcProvider from 'oidc-provider';
import {OIDCServiceBindings} from '../keys';

export class OidcController {
  constructor(
    @inject(RestBindings.Http.CONTEXT)
    private readonly requestContext: RequestContext,
    @inject(OIDCServiceBindings.OIDC_PROVIDER)
    private readonly oidcProvider: OidcProvider,
    @inject(OIDCServiceBindings.LoginTemplate)
    private readonly loginTemplateFilePath: string,
    @inject(OIDCServiceBindings.InteractionTemplate)
    private readonly interactionTemplateFilePath: string,
    @repository(UserRepository)
    protected readonly userRepository: UserRepository,
  ) {}

  @get('/interaction/{uid}', {
    responses: {
      '200': {
        description: 'login page',
        content: {
          type: 'text/html',
        },
      },
    },
  })
  async interaction() {
    const {uid, prompt, params} = await this.oidcProvider.interactionDetails(
      this.requestContext.request,
      this.requestContext.response,
    );
    const client = await this.oidcProvider.Client.find(
      params.client_id as string,
    );
    switch (prompt.name) {
      case 'login': {
        const html = await ejs.renderFile(this.loginTemplateFilePath, {
          client,
          uid,
          details: prompt.details,
          params,
          title: 'Sign in',
        });
        this.requestContext.response
          .status(STATUS_CODE.OK)
          .contentType('text/html')
          .send(html);
        return;
      }
      case 'consent': {
        const html = await ejs.renderFile(this.interactionTemplateFilePath, {
          client,
          uid,
          details: prompt.details,
          params,
          title: 'Authorize',
        });
        this.requestContext.response
          .status(STATUS_CODE.OK)
          .contentType('text/html')
          .send(html);
        return;
      }
      default:
        return undefined;
    }
  }

  @post('/interaction/{uid}/login')
  async login(
    @requestBody({
      content: {
        'application/x-www-form-urlencoded': {},
      },
    })
    requestData: {
      username: string;
      password: string;
    },
  ) {
    const {username, password} = requestData;
    const user = await this.userRepository.verifyPassword(username, password);
    if (user === undefined || user === null || !user) {
      return 'The user does not exist or is not authenticated.';
    }
    //authenticated user enters
    try {
      const result = {
        login: {
          accountId: username,
        },
      };
      await this.oidcProvider.interactionFinished(
        this.requestContext.request,
        this.requestContext.response,
        result,
      );
    } catch (error) {
      throw new Error(`Something went wrong: ${error.message}`);
    }
  }

  @post('/interaction/{uid}/confirm')
  async confirm() {
    const interactionDetails = await this.oidcProvider.interactionDetails(
      this.requestContext.request,
      this.requestContext.response,
    );

    let {grantId} = interactionDetails;

    const {
      prompt: {details},
      params,
    } = interactionDetails;

    let grant;
    if (grantId) {
      // modifying existing grant in existing session
      grant = await this.oidcProvider.Grant.find(grantId);
    } else {
      // establishing a new grant
      const accountId = interactionDetails.session?.accountId;
      grant = new this.oidcProvider.Grant({
        accountId,
        clientId: params.client_id as string,
      });
    }
    if (details.missingOIDCScope) {
      const scopesToAdd = (details.missingOIDCScope as Array<string>).join(' ');
      grant?.addOIDCScope(scopesToAdd);
    }

    if (details.missingOIDCClaims) {
      grant?.addOIDCClaims(details.missingOIDCClaims as Array<string>);
    }
    grantId = await grant?.save();
    const consent: {grantId?: string} = {};

    if (!interactionDetails.grantId) {
      consent.grantId = grantId;
    }

    const result = {consent};
    await this.oidcProvider.interactionFinished(
      this.requestContext.request,
      this.requestContext.response,
      result,
      {mergeWithLastSubmission: true},
    );
  }
}
