import {BindingScope, injectable, Provider} from '@loopback/core';
import {nanoid} from 'nanoid/async';

export type MeetingLinkIdGenerator = () => Promise<string>;

const nanoId = 10;
@injectable({scope: BindingScope.TRANSIENT})
export class MeetingLinkIdGeneratorProvider
  implements Provider<MeetingLinkIdGenerator>
{
  async value() {
    return (): Promise<string> => {
      return nanoid(nanoId);
    };
  }
}

//returning function
