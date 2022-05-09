import {inject} from '@loopback/context';
import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, Response, RestBindings} from '@loopback/rest';
import {ILogger, LOGGER} from '@sourceloop/core';
import {AuthErrorKeys} from 'loopback4-authentication';
import {AuthClient} from '../models';
import {OtpResponse} from '../modules/auth';
import {OtpFn, VerifyBindings} from '../providers';
import {OtpCacheRepository, UserRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class OtpSenderService {
  constructor(
    @repository(OtpCacheRepository)
    private readonly otpCacheRepo: OtpCacheRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(LOGGER.LOGGER_INJECT) private readonly logger: ILogger,
    @inject(VerifyBindings.OTP_PROVIDER)
    private readonly otpSender: OtpFn,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
  ) {}

  async sendOtp(
    client: AuthClient,
    username: string,
  ): Promise<OtpResponse | void> {
    if (!client) {
      this.logger.error('Auth client not found or invalid');
      throw new HttpErrors.Unauthorized(AuthErrorKeys.ClientInvalid);
    }

    const res: OtpResponse = await this.otpSender(username);

    await this.otpCacheRepo.delete(username);
    await this.otpCacheRepo.set(username, {
      otpSecret: res.key,
      clientId: client.clientId,
      clientSecret: client.secret,
    });

    if (res.qrCode) {
      this.response.send({
        qrCode: res.qrCode,
      });
    }
  }
}
