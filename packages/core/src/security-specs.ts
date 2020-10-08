import {ReferenceObject, SecuritySchemeObject} from '@loopback/openapi-v3';
export const OPERATION_SECURITY_SPEC = [{HTTPBearer: []}];
export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject;
};
export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
  HTTPBearer: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
};
