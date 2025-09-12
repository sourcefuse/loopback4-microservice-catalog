import {
  Constructor,
  inject,
  MetadataInspector,
  Provider,
} from '@loopback/context';
import {CoreBindings, injectable, BindingScope} from '@loopback/core';

import {FileUtilBindings} from '../keys';
import {IFileRequestMetadata} from '../types';

@injectable({scope: BindingScope.TRANSIENT})
export class FileMetadataProvider
  implements Provider<IFileRequestMetadata | undefined>
{
  constructor(
    @inject(CoreBindings.CONTROLLER_CLASS, {optional: true})
    private readonly controllerClass: Constructor<{}>,
    @inject(CoreBindings.CONTROLLER_METHOD_NAME, {optional: true})
    private readonly methodName: string,
  ) {}

  /**
   * This function retrieves file request metadata for a controller class method, ensuring only one
   * file decorator is allowed.
   * @returns The `value()` method returns an `IFileRequestMetadata` object or `undefined`.
   */
  value(): IFileRequestMetadata | undefined {
    if (!this.controllerClass || !this.methodName) return;
    const metadata = getFileMetadata(this.controllerClass, this.methodName);
    if (metadata && metadata.length > 1) {
      throw Error('Multiple file decorators not supported');
    }
    return metadata?.[0];
  }
}

export function getFileMetadata(
  controllerClass: Constructor<{}>,
  methodName: string,
): IFileRequestMetadata[] | undefined {
  return MetadataInspector.getMethodMetadata<IFileRequestMetadata[]>(
    FileUtilBindings.FILE_REQUEST_METADATA,
    controllerClass.prototype,
    methodName,
  );
}
