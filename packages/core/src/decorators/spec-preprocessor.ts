import {MetadataInspector} from '@loopback/metadata';
import {AUTHORIZATION_METADATA_ACCESSOR} from 'loopback4-authorization';
import {OperationObject} from 'openapi3-ts';

const defaultResponse = (ctor: {name: string}, op: string) => ({
  '200': {
    description: `Return value of ${ctor.name}.${op}`,
  },
});

export const specPreprocessor = (
  target: Object,
  propertyKey: string,
  spec?: OperationObject,
) => {
  const authorizations = MetadataInspector.getMethodMetadata<{permissions: []}>(
    AUTHORIZATION_METADATA_ACCESSOR,
    target,
    propertyKey,
  );
  let desc = spec?.description ?? '';
  if (authorizations?.permissions && authorizations?.permissions.length > 0) {
    authorizations.permissions
      .filter((permission: string) => permission.trim() !== '*')
      .forEach((permission, i) => {
        if (i === 0) {
          desc += `Roles authorized to use this endpoint -\n| Permissions |\n| ------- |\n`;
        }
        desc += `| ${permission}   |\n`;
      });
  }
  if (spec) {
    spec.description = desc;
  } else {
    spec = {
      description: desc,
      responses: defaultResponse(target.constructor, propertyKey),
    } as OperationObject;
  }
  return spec;
};
