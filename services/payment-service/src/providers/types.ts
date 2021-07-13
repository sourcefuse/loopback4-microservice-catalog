import {Orders} from '../models';

export interface IGateway {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  create(payorder: Orders): Promise<any>;
}
