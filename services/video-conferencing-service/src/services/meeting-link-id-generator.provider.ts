import {BindingScope, injectable, Provider} from '@loopback/core';
import {Options} from 'crypto-random-string';

const cryptoRandomString = (options: Options) =>
  import('crypto-random-string').then(({default: f}) => f(options));

export type MeetingLinkIdGenerator = () => Promise<string>;

@injectable({scope: BindingScope.TRANSIENT})
export class MeetingLinkIdGeneratorProvider
  implements Provider<MeetingLinkIdGenerator>
{
  value() {
    return (): Promise<string> => {
      return cryptoRandomString({
        length: 10,
        type: 'url-safe',
      });
    };
  }
}

//returning function
