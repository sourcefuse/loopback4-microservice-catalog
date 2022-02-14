import {BindingScope, injectable, Provider} from '@loopback/core';
import {nanoid} from 'nanoid/async';

export type MeetingLinkIdGenerator = () => Promise<string>;

@injectable({scope: BindingScope.TRANSIENT})
export class MeetingLinkIdGeneratorProvider
  implements Provider<MeetingLinkIdGenerator>
{
  async value() {
    return (): Promise<string> => {
      return nanoid(10);
    };
  }
}

//returning function
