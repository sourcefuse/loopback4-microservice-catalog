import multer from 'multer';
import {
  IFileRequestMetadata,
  IModelWithFileMetadata,
  MulterUploadOptions,
} from './types';

const KB = 1024;
const MB = KB * KB;
const FIVE = 5;
export const DEFAULT_MULTER_LIMITS: multer.Options['limits'] = {
  fileSize: process.env.UPLOAD_FILE_SIZE_LIMIT
    ? parseInt(process.env.UPLOAD_FILE_SIZE_LIMIT) * MB + 1
    : FIVE * MB + 1, // 5 MB
  files: 1,
};
export const DEFAULT_TEXT_FILE_TYPES = ['.csv', '.txt', '.svg'];
export const NAME_REGEX = /[!@#$%^*,.?":{}|<>]/;

/* `ContentDisposition` enum has two members: `Inline` and `Attachment`.
When we want that file is url is generate to view file in browser (pdf),
then in s3Config we set ResponseContentDisposition as 'inline' along with file name,
and if we want our url to download the file we set it as 'attachment' */
export enum ContentDisposition {
  Inline = 'inline',
  Attachment = 'attachment',
}
export const DEFAULT_CLAMAV_PORT = 3310;

export function getUploadConfig(
  metadata: IModelWithFileMetadata<never>,
  uploadOptions: MulterUploadOptions,
) {
  return uploadOptions.definition
    ? (uploadOptions as IFileRequestMetadata<never>)
    : metadata;
}
