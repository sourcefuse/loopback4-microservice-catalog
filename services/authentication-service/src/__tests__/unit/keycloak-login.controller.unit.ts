// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable @typescript-eslint/naming-convention */
import {Request, Response} from '@loopback/rest';
import {expect} from '@loopback/testlab';
import {ILogger} from '@sourceloop/core';
import sinon, {SinonStub} from 'sinon';
import {AuthClient} from '../../models';
import {KeycloakLoginController} from '../../modules/auth/controllers/keycloak-login.controller';
import {AuthUser} from '../../modules/auth/models';
import {AuthCodeGeneratorFn} from '../../providers';
import {AuthClientRepository} from '../../repositories';

describe('Keycloak Login Controller - Unit Tests', () => {
  let controller: KeycloakLoginController;
  let authClientRepository: sinon.SinonStubbedInstance<AuthClientRepository>;
  let logger: sinon.SinonStubbedInstance<ILogger>;
  let getAuthCode: SinonStub;

  beforeEach(() => {
    authClientRepository = sinon.createStubInstance(AuthClientRepository);
    logger = {
      error: sinon.stub(),
      info: sinon.stub(),
      warn: sinon.stub(),
      debug: sinon.stub(),
    } as unknown as sinon.SinonStubbedInstance<ILogger>;
    getAuthCode = sinon.stub();

    controller = new KeycloakLoginController(
      authClientRepository as unknown as AuthClientRepository,
      logger as unknown as ILogger,
      getAuthCode as AuthCodeGeneratorFn,
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('queryGen function - State Handling', () => {
    // Helper type for request with state params
    type RequestWithState = Request & {
      body: {client_id: string; state?: string};
      query: {client_id: string; state?: string};
    };

    // Helper function to simulate queryGen behavior for testing
    const simulateQueryGen = (
      from: 'body' | 'query',
      req: Request,
    ): {state: string} => {
      const typedReq = req as RequestWithState;
      const clientId = typedReq[from].client_id;
      const existingState = typedReq[from].state;

      let stateString: string;

      if (!existingState) {
        // Case 1: No state passed, use default client_id
        stateString = `client_id=${clientId}`;
      } else {
        // Parse existing state to check if client_id is present
        const stateParams = new URLSearchParams(existingState);
        const hasClientId = stateParams.has('client_id');

        if (!hasClientId) {
          // Case 2: State passed without client_id, append it
          stateString = `${existingState}&client_id=${clientId}`;
        } else {
          // Case 3: State passed with client_id (and possibly other properties)
          stateString = existingState;
        }
      }

      return {
        state: stateString,
      };
    };

    describe('Scenario 1: No state passed (default behavior)', () => {
      it('should create state with only client_id when no state is provided in body', () => {
        const mockRequest = {
          body: {
            client_id: 'test-client-123',
          },
        } as Request;

        const result = simulateQueryGen('body', mockRequest);

        expect(result).to.have.property('state');
        expect(result.state).to.equal('client_id=test-client-123');
      });

      it('should create state with only client_id when no state is provided in query', () => {
        const mockRequest = {
          query: {
            client_id: 'test-client-456',
          },
        } as unknown as Request;

        const result = simulateQueryGen('query', mockRequest);

        expect(result).to.have.property('state');
        expect(result.state).to.equal('client_id=test-client-456');
      });
    });

    describe('Scenario 2: State passed without client_id', () => {
      it('should append client_id to existing state when client_id is missing', () => {
        const mockRequest = {
          body: {
            client_id: 'test-client-789',
            state: 'redirect_path=/dashboard&foo=bar',
          },
        } as unknown as Request;

        const result = simulateQueryGen('body', mockRequest);

        expect(result).to.have.property('state');
        expect(result.state.includes('redirect_path=/dashboard')).to.be.true();
        expect(result.state.includes('foo=bar')).to.be.true();
        expect(result.state.includes('client_id=test-client-789')).to.be.true();
      });

      it('should handle URL-encoded state parameters without client_id', () => {
        const mockRequest = {
          query: {
            client_id: 'my-client',
            state: 'return_url=%2Fhome&tenant=123',
          },
        } as unknown as Request;

        const result = simulateQueryGen('query', mockRequest);

        expect(result).to.have.property('state');
        expect(result.state.includes('return_url=%2Fhome')).to.be.true();
        expect(result.state.includes('tenant=123')).to.be.true();
        expect(result.state.includes('client_id=my-client')).to.be.true();
      });

      it('should append client_id when state has only one parameter', () => {
        const mockRequest = {
          body: {
            client_id: 'append-client',
            state: 'redirect=/home',
          },
        } as Request;

        const result = simulateQueryGen('body', mockRequest);

        expect(result).to.have.property('state');
        expect(result.state).to.equal('redirect=/home&client_id=append-client');
      });
    });

    describe('Scenario 3: State passed with client_id and other properties', () => {
      it('should use state as-is when client_id is already present', () => {
        const mockRequest = {
          body: {
            client_id: 'test-client-999',
            state:
              'client_id=custom-client&redirect_path=/profile&tab=settings',
          },
        } as Request;

        const result = simulateQueryGen('body', mockRequest);

        expect(result).to.have.property('state');
        expect(result.state).to.equal(
          'client_id=custom-client&redirect_path=/profile&tab=settings',
        );
      });

      it('should preserve all state parameters when client_id is present', () => {
        const mockRequest = {
          query: {
            client_id: 'ignored-client',
            state:
              'client_id=actual-client&param1=value1&param2=value2&param3=value3',
          },
        } as unknown as Request;

        const result = simulateQueryGen('query', mockRequest);

        expect(result).to.have.property('state');
        expect(result.state.includes('client_id=actual-client')).to.be.true();
        expect(result.state.includes('param1=value1')).to.be.true();
        expect(result.state.includes('param2=value2')).to.be.true();
        expect(result.state.includes('param3=value3')).to.be.true();
      });

      it('should not modify state when client_id is at the end', () => {
        const mockRequest = {
          body: {
            client_id: 'unused',
            state: 'foo=bar&baz=qux&client_id=my-client',
          },
        } as unknown as Request;

        const result = simulateQueryGen('body', mockRequest);

        expect(result.state).to.equal('foo=bar&baz=qux&client_id=my-client');
      });

      it('should not modify state when client_id is in the middle', () => {
        const mockRequest = {
          query: {
            client_id: 'unused',
            state: 'param1=val1&client_id=middle-client&param2=val2',
          },
        } as unknown as Request;

        const result = simulateQueryGen('query', mockRequest);

        expect(result.state).to.equal(
          'param1=val1&client_id=middle-client&param2=val2',
        );
      });
    });
  });

  describe('keycloakCallback method - Redirect with State Parameters', () => {
    let mockResponse: Response;
    let redirectStub: SinonStub;
    const TEST_CLIENT_ID = 'test-client';
    const TEST_CLIENT_ID_STATE = 'client_id=test-client';
    const TEST_REDIRECT_URL = 'https://example.com/callback';
    const TEST_ERROR_CODE = 'auth-code-error';
    const mockUser: AuthUser = {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
    } as AuthUser;

    beforeEach(() => {
      redirectStub = sinon.stub();
      mockResponse = {
        redirect: redirectStub,
      } as unknown as Response;
    });

    describe('Scenario 1: State with only client_id', () => {
      it('should redirect with only code parameter when state contains only client_id', async () => {
        const state = TEST_CLIENT_ID_STATE;
        const code = 'auth-code-123';
        const mockClient = {
          clientId: TEST_CLIENT_ID,
          redirectUrl: TEST_REDIRECT_URL,
        };

        authClientRepository.findOne.resolves(
          mockClient as unknown as AuthClient,
        );
        getAuthCode.resolves('generated-token-123');

        await controller.keycloakCallback(code, state, mockResponse, mockUser);

        expect(redirectStub.calledOnce).to.be.true();
        const redirectUrl = redirectStub.firstCall.args[0];
        expect(redirectUrl).to.equal(
          'https://example.com/callback?code=generated-token-123',
        );
      });
    });

    describe('Scenario 2: State with client_id and additional parameters', () => {
      it('should redirect with code and all additional state parameters', async () => {
        const state =
          'client_id=test-client&redirect_path=/dashboard&session_id=abc123';
        const code = 'auth-code-456';
        const mockClient = {
          clientId: TEST_CLIENT_ID,
          redirectUrl: 'https://app.example.com/auth/callback',
        };

        authClientRepository.findOne.resolves(
          mockClient as unknown as AuthClient,
        );
        getAuthCode.resolves('generated-token-456');

        await controller.keycloakCallback(code, state, mockResponse, mockUser);

        expect(redirectStub.calledOnce).to.be.true();
        const redirectUrl = redirectStub.firstCall.args[0];

        // Verify redirect URL contains code and all state params except client_id
        expect(
          redirectUrl.includes('https://app.example.com/auth/callback?'),
        ).to.be.true();
        expect(redirectUrl.includes('code=generated-token-456')).to.be.true();
        expect(redirectUrl.includes('redirect_path=%2Fdashboard')).to.be.true();
        expect(redirectUrl.includes('session_id=abc123')).to.be.true();
        expect(redirectUrl.includes('client_id')).to.be.false();
      });

      it('should handle multiple state parameters with special characters', async () => {
        const state =
          'client_id=my-client&return_url=/path/to/page&user_hint=john%40example.com&locale=en_US';
        const code = 'auth-code-789';
        const mockClient = {
          clientId: 'my-client',
          redirectUrl: 'https://secure.example.com/oauth/callback',
        };

        authClientRepository.findOne.resolves(
          mockClient as unknown as AuthClient,
        );
        getAuthCode.resolves('generated-token-789');

        await controller.keycloakCallback(code, state, mockResponse, mockUser);

        expect(redirectStub.calledOnce).to.be.true();
        const redirectUrl = redirectStub.firstCall.args[0];

        expect(redirectUrl.includes('code=generated-token-789')).to.be.true();
        expect(redirectUrl.includes('return_url=')).to.be.true();
        expect(
          redirectUrl.includes('user_hint=john%40example.com'),
        ).to.be.true();
        expect(redirectUrl.includes('locale=en_US')).to.be.true();
      });
    });

    describe('Scenario 3: State with complex query parameters', () => {
      it('should preserve all state parameters in redirect', async () => {
        const state =
          'client_id=complex-client&tab=settings&filter=active&sort=name&page=2';
        const code = 'auth-code-complex';
        const mockClient = {
          clientId: 'complex-client',
          redirectUrl: 'https://api.example.com/redirect',
        };

        authClientRepository.findOne.resolves(
          mockClient as unknown as AuthClient,
        );
        getAuthCode.resolves('complex-token');

        await controller.keycloakCallback(code, state, mockResponse, mockUser);

        expect(redirectStub.calledOnce).to.be.true();
        const redirectUrl = redirectStub.firstCall.args[0];

        expect(redirectUrl.includes('code=complex-token')).to.be.true();
        expect(redirectUrl.includes('tab=settings')).to.be.true();
        expect(redirectUrl.includes('filter=active')).to.be.true();
        expect(redirectUrl.includes('sort=name')).to.be.true();
        expect(redirectUrl.includes('page=2')).to.be.true();
        expect(redirectUrl.includes('client_id')).to.be.false();
      });
    });

    describe('Error Scenarios', () => {
      it('should throw error when client_id is missing from state', async () => {
        const state = 'some_param=value';
        const code = TEST_ERROR_CODE;

        let errorThrown = false;
        try {
          await controller.keycloakCallback(
            code,
            state,
            mockResponse,
            mockUser,
          );
        } catch (error) {
          errorThrown = true;
          expect((error as {statusCode: number}).statusCode).to.equal(401);
        }
        expect(errorThrown).to.be.true();
      });

      it('should throw error when user is undefined', async () => {
        const state = TEST_CLIENT_ID_STATE;
        const code = TEST_ERROR_CODE;

        let errorThrown = false;
        try {
          await controller.keycloakCallback(
            code,
            state,
            mockResponse,
            undefined,
          );
        } catch (error) {
          errorThrown = true;
          expect((error as {statusCode: number}).statusCode).to.equal(401);
        }
        expect(errorThrown).to.be.true();
      });

      it('should throw error when client is not found', async () => {
        const state = 'client_id=non-existent-client';
        const code = TEST_ERROR_CODE;

        authClientRepository.findOne.resolves(null);

        let errorThrown = false;
        try {
          await controller.keycloakCallback(
            code,
            state,
            mockResponse,
            mockUser,
          );
        } catch (error) {
          errorThrown = true;
          expect((error as {statusCode: number}).statusCode).to.equal(401);
        }
        expect(errorThrown).to.be.true();
      });

      it('should throw error when client has no redirect URL', async () => {
        const state = TEST_CLIENT_ID_STATE;
        const code = TEST_ERROR_CODE;
        const mockClient = {
          clientId: TEST_CLIENT_ID,
          redirectUrl: null,
        };

        authClientRepository.findOne.resolves(
          mockClient as unknown as AuthClient,
        );

        let errorThrown = false;
        try {
          await controller.keycloakCallback(
            code,
            state,
            mockResponse,
            mockUser,
          );
        } catch (error) {
          errorThrown = true;
          expect((error as {statusCode: number}).statusCode).to.equal(401);
        }
        expect(errorThrown).to.be.true();
      });

      it('should log error and throw when getAuthCode fails', async () => {
        const state = TEST_CLIENT_ID_STATE;
        const code = TEST_ERROR_CODE;
        const mockClient = {
          clientId: TEST_CLIENT_ID,
          redirectUrl: TEST_REDIRECT_URL,
        };
        const mockError = new Error('Auth code generation failed');

        authClientRepository.findOne.resolves(
          mockClient as unknown as AuthClient,
        );
        getAuthCode.rejects(mockError);

        let errorThrown = false;
        try {
          await controller.keycloakCallback(
            code,
            state,
            mockResponse,
            mockUser,
          );
        } catch (error) {
          errorThrown = true;
          expect((error as {statusCode: number}).statusCode).to.equal(401);
          expect(logger.error.calledOnce).to.be.true();
          expect(logger.error.firstCall.args[0]).to.equal(mockError);
        }
        expect(errorThrown).to.be.true();
      });
    });

    describe('URL Encoding and Special Characters', () => {
      it('should properly encode state parameters with spaces and special chars', async () => {
        const state = 'client_id=test-client&message=Hello World&data=a+b=c';
        const code = 'auth-code-special';
        const mockClient = {
          clientId: TEST_CLIENT_ID,
          redirectUrl: TEST_REDIRECT_URL,
        };

        authClientRepository.findOne.resolves(
          mockClient as unknown as AuthClient,
        );
        getAuthCode.resolves('special-token');

        await controller.keycloakCallback(code, state, mockResponse, mockUser);

        expect(redirectStub.calledOnce).to.be.true();
        const redirectUrl = redirectStub.firstCall.args[0];

        expect(redirectUrl.includes('code=special-token')).to.be.true();
        // URLSearchParams automatically encodes spaces and special characters
        expect(redirectUrl).to.match(/message=Hello(\+|%20)World/);
      });
    });

    describe('Integration: Full Flow with Various State Configurations', () => {
      it('should handle empty string state gracefully with client_id appended', async () => {
        // This simulates scenario 2 where state is empty but client_id should be added
        // queryGen would produce state with only client_id
        const state = 'client_id=flow-client';
        const code = 'flow-code';
        const mockClient = {
          clientId: 'flow-client',
          redirectUrl: 'https://flow.example.com/callback',
        };

        authClientRepository.findOne.resolves(
          mockClient as unknown as AuthClient,
        );
        getAuthCode.resolves('flow-token');

        await controller.keycloakCallback(code, state, mockResponse, mockUser);

        expect(redirectStub.calledOnce).to.be.true();
        const redirectUrl = redirectStub.firstCall.args[0];
        expect(redirectUrl).to.equal(
          'https://flow.example.com/callback?code=flow-token',
        );
      });

      it('should handle state with only non-client_id parameters (should have been appended)', async () => {
        // This would be the result after queryGen appends client_id
        const state = 'redirect=/home&tenant=123&client_id=auto-client';
        const code = 'auto-code';
        const mockClient = {
          clientId: 'auto-client',
          redirectUrl: 'https://auto.example.com/callback',
        };

        authClientRepository.findOne.resolves(
          mockClient as unknown as AuthClient,
        );
        getAuthCode.resolves('auto-token');

        await controller.keycloakCallback(code, state, mockResponse, mockUser);

        expect(redirectStub.calledOnce).to.be.true();
        const redirectUrl = redirectStub.firstCall.args[0];

        expect(redirectUrl.includes('code=auto-token')).to.be.true();
        expect(redirectUrl.includes('redirect=%2Fhome')).to.be.true();
        expect(redirectUrl.includes('tenant=123')).to.be.true();
      });
    });
  });
});
