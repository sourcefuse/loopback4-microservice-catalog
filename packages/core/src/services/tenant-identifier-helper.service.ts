import {bind, BindingScope} from '@loopback/core';
const jwt = require('jsonwebtoken');

@bind({scope: BindingScope.TRANSIENT})
export class TenantIdentifierHelperService {
  /**
   *
   * @param token sting
   * @returns tenantId sting
   */
  async getTenantIdFromToken(tokenWithBearerString: string) {
    /* Driver code */
    const bearerStr = 'Bearer';
    const isBearer = tokenWithBearerString.includes(bearerStr);
    const tokenArr = isBearer
      ? tokenWithBearerString.split(' ')
      : tokenWithBearerString.split('');
    const token = tokenArr[1];
    let tenantId = null;
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
        algorithms: ['HS256'],
      });

      if (payload?.tenantId) {
        tenantId = payload['tenantId'] as string;
      }
    }
    return tenantId == null ? null : {id: tenantId};
  }
}
