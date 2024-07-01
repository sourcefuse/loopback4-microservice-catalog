// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {get, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {
  CONTENT_TYPE,
  ErrorCodes,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {
  AuthenticationBindings,
  STRATEGY,
  authenticate,
} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {LocalUserProfileDto} from '../models/local-user-profile';
import {SignupRequestDto} from '../models/signup-request-dto.model';
import {SignupRequest} from '../models/signup-request.model';
import {SignupWithTokenReponseDto} from '../models/signup-with-token-response-dto.model';
import {
  AuthCodeBindings,
  JWTSignerFn,
  SignUpBindings,
  SignupTokenHandlerFn,
  VerifyBindings,
} from '../providers';
import {PreSignupFn, UserSignupFn} from '../types';

const successResponse = 'Sucess Response.';
const basePath = '/auth/sign-up';
export class SignupRequestController {
  constructor(
    @inject(SignUpBindings.PRE_LOCAL_SIGNUP_PROVIDER)
    private readonly preSignupFn: PreSignupFn<LocalUserProfileDto, AnyObject>,
    @inject(SignUpBindings.LOCAL_SIGNUP_PROVIDER)
    private readonly userSignupFn: UserSignupFn<LocalUserProfileDto, AnyObject>,
    @inject(AuthCodeBindings.JWT_SIGNER.key)
    private readonly jwtSigner: JWTSignerFn<AnyObject>,
  ) {}

  @authorize({permissions: ['*']})
  @post(`${basePath}/create-token`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: successResponse,
      },
      ...ErrorCodes,
    },
  })
  async requestSignup(
    @requestBody()
    signUpRequest: SignupRequestDto<LocalUserProfileDto>,
    @inject(SignUpBindings.SIGNUP_HANDLER_PROVIDER)
    handler: SignupTokenHandlerFn,
  ): Promise<void> {
    // Default expiry is 30 minutes
    const expiryDuration = parseInt(
      process.env.REQUEST_SIGNUP_LINK_EXPIRY ?? '1800',
    );

    const codePayload = await this.preSignupFn(signUpRequest);
    const token = await this.jwtSigner(codePayload, {
      subject: signUpRequest.email,
      expiresIn: expiryDuration,
    });
    await handler({
      code: token,
      expiry: expiryDuration,
      email: signUpRequest.email,
    });
  }

  @authenticate(
    STRATEGY.BEARER,
    {},
    undefined,
    VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER,
  )
  @authorize({permissions: ['*']})
  @post(`${basePath}/create-user`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: successResponse,
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(LocalUserProfileDto),
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async signupWithToken(
    @requestBody()
    req: LocalUserProfileDto,
    @inject(AuthenticationBindings.CURRENT_USER)
    signupUser: SignupRequest,
  ): Promise<SignupWithTokenReponseDto<AnyObject>> {
    const user = await this.userSignupFn(req, signupUser);

    return new SignupWithTokenReponseDto<AnyObject>({
      email: req.email,
      user: user,
    });
  }

  @authenticate(
    STRATEGY.BEARER,
    {},
    undefined,
    VerifyBindings.BEARER_SIGNUP_VERIFY_PROVIDER,
  )
  @authorize({permissions: ['*']})
  @get(`${basePath}/verify-token`, {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: successResponse,
      },
      ...ErrorCodes,
    },
  })
  async verifyInviteToken(
    @inject(AuthenticationBindings.CURRENT_USER)
    signupUser: SignupRequest,
  ): Promise<SignupRequest> {
    return signupUser;
  }
}
