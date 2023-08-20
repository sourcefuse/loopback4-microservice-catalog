import {BindingScope, injectable} from '@loopback/context';
import {AnyObject} from '@loopback/repository';

@injectable({scope: BindingScope.TRANSIENT})
export class UtilityService {
  public transformObject(obj?: AnyObject) {
    const transformed: AnyObject = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        transformed[key] = {value: obj[key]};
      }
    }

    return transformed;
  }
}
