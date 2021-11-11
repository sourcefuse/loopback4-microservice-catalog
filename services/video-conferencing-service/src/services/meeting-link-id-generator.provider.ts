import {injectable, /* inject, */ BindingScope, Provider} from '@loopback/core';

import cryptoRandomString from 'crypto-random-string';

export type MeetingLinkIdGenerator = () => string;

@injectable({scope: BindingScope.TRANSIENT})
export class MeetingLinkIdGeneratorProvider
  implements Provider<MeetingLinkIdGenerator>
{
  value() {
    return (): string => {
      return cryptoRandomString({
        length: 10,
        type: 'url-safe',
      });
    };
  }
}

//returning function
