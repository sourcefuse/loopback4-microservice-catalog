// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  post,
  requestBody,
  RequestContext,
  Response,
  RestBindings
} from '@loopback/rest';
import { UserRepository } from '../repositories/user.repository';
import ejs from 'ejs';
import path from 'path';
import {oidcProvider} from '../services/oidc-service';

export class OidcController {
  constructor(
    @inject(RestBindings.Http.CONTEXT) private requestContext: RequestContext,
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
    const {uid, prompt, params, session} =
      await oidcProvider.interactionDetails(
        this.requestContext.request,
        this.requestContext.response,
      );
    const client = await oidcProvider.Client.find(params.client_id as string);
    switch (prompt.name) {
      case 'login': {
        const html = await ejs.renderFile(
          // path.join(__dirname, '../../public/views/login.ejs'),
          path.join(__dirname, '../public/views/login.ejs'),
          {
            client,
            uid,
            details: prompt.details,
            params,
            title: 'Sign-in',
          },
        );
        this.requestContext.response
          .status(200)
          .contentType('text/html')
          .send(html);
        return;
      }
      case 'consent': {
        const html = await ejs.renderFile(
          // path.join(__dirname, '../../public/views/interaction.ejs'),
          path.join(__dirname, '../public/views/interaction.ejs'),
          {
            client,
            uid,
            details: prompt.details,
            params,
            title: 'Authorize',
          },
        );
        this.requestContext.response
          .status(200)
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
    _requestBody: {
      username: string;
      password: string;
    },
    @inject(RestBindings.Http.RESPONSE) response2: Response,
  ) {
    const {username,password} = _requestBody;
    const user = await this.userRepository.verifyPassword(username, password);
    if(user === undefined || user === null || !user){
        return 'user not exist or not authenticated';

    }
    //authenticated user enters
    try {
      const result = {
        login: {
          accountId: username,
        },
      };
      await oidcProvider.interactionFinished(
        this.requestContext.request,
        this.requestContext.response,
        result,
      );
    } catch {
      throw new Error('Something went wrong');
    }
  }

  @post('/interaction/{uid}/confirm')
  async confirm() {
    const interactionDetails = await oidcProvider.interactionDetails(
      this.requestContext.request,
      this.requestContext.response,
    );

    let {grantId} = interactionDetails;

    const {
      prompt: {name, details},
      params,
    } = interactionDetails;

    let grant;
    if (grantId) {
      // modifying existing grant in existing session
      grant = await oidcProvider.Grant.find(grantId);
    } else {
      // establishing a new grant
      const accountId = interactionDetails.session?.accountId;
      grant = new oidcProvider.Grant({
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
    await oidcProvider.interactionFinished(
      this.requestContext.request,
      this.requestContext.response,
      result,
      {mergeWithLastSubmission: true},
    );
  }
}
