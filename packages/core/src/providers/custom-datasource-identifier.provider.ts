import {Provider} from '@loopback/core';
import {DatasourceIdentifierFn} from 'loopback4-dynamic-datasource';
const jwt = require('jsonwebtoken');

export class CustomDatasourceIdentifierProvider
  implements Provider<DatasourceIdentifierFn>
{
  constructor() {}
  value(): DatasourceIdentifierFn {
    return async requestCtx => {
      const tokenWithBearerString = String(
        requestCtx.request.headers?.authorization,
      );
      /* Driver code */
      var bearerStr = 'Bearer';
      const isBearer = tokenWithBearerString.includes(bearerStr);
      const tokenArr = isBearer
        ? tokenWithBearerString.split(' ')
        : tokenWithBearerString.split('');
      const token = tokenArr[1];
      let tenantId = null;
      if (token) {
        let payload = jwt.verify(token, process.env.JWT_SECRET as string, {
          issuer: process.env.JWT_ISSUER,
          algorithms: ['HS256'],
        });

        if (payload?.tenantId) {
          tenantId = payload['tenantId'] as string;
        }
      }
      return tenantId == null ? null : {id: tenantId};
    };
  }
}
