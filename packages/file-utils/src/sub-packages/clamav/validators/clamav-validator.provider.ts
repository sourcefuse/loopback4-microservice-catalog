import {HttpErrors} from '@loopback/rest';
import NodeClam from 'clamscan';
import {PassThrough} from 'stream';
import {DEFAULT_CLAMAV_PORT} from '../../../constant';
import {fileValidator} from '../../../decorators';
import {File, IFileValidator} from '../../../types';
@fileValidator()
export class ClamAVValidator implements IFileValidator {
  async validate(file: File): Promise<File> {
    if (!process.env.CLAMAV_HOST) {
      throw HttpErrors.InternalServerError('Host not configured');
    }
    const clamd = await new NodeClam().init({
      clamdscan: {
        host: process.env.CLAMAV_HOST,
        port: Number(process.env.CLAMAV_PORT ?? DEFAULT_CLAMAV_PORT),
      },
    });
    const cloneStream = new PassThrough();
    file.stream.pipe(cloneStream);
    const cleanup = () => {
      cloneStream.destroy();
    };
    try {
      const result = await clamd.scanStream(cloneStream);
      if (result.isInfected) {
        throw new HttpErrors.BadRequest(`Infected file: ${file.originalname}`);
      }
    } catch (err) {
      cleanup();
      throw err;
    }
    return file;
  }
}
