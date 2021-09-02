import {injectable, /* inject, */ BindingScope, Provider} from '@loopback/core';

import cryptoRandomString from 'crypto-random-string';

export type MeetingLinkIdGenerator = () => string;

@injectable({scope: BindingScope.TRANSIENT})
export class MeetingLinkIdGeneratorProvider
  implements Provider<MeetingLinkIdGenerator>
{
  constructor() {}

  value() {
    return (): string => {
      const meetingLinkId = cryptoRandomString({
        length: 10,
        type: 'url-safe',
      });

      return meetingLinkId;
    };
  }
}

//returning function
