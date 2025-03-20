import {HttpErrors} from '@loopback/rest';
import NodeClam from 'clamscan';
import {PassThrough} from 'stream';
import {DEFAULT_CLAMAV_PORT} from '../../../constant';
import {fileValidator} from '../../../decorators';
import {File, IFileValidator, ValidatorOutput} from '../../../types';
@fileValidator()
export class ClamAVValidator implements IFileValidator {
  async validate(file: File): Promise<ValidatorOutput> {
    if (!process.env.CLAMAV_HOST) {
      throw HttpErrors.InternalServerError('Host not configured');
    }
    const clamd = await new NodeClam().init({
      clamdscan: {
        host: process.env.CLAMAV_HOST,
        port: Number(process.env.CLAMAV_PORT ?? DEFAULT_CLAMAV_PORT),
      },
    });
    const pass = clamd.passthrough();
    const newTarget = new PassThrough();
    file.stream.pipe(pass).pipe(newTarget);
    const waiter = new Promise<string | null>((resolve, reject) => {
      pass.on('error', err => {
        resolve(err.message);
      });
      pass.on('scan-complete', result => {
        if (result.isInfected) {
          resolve(`File is infected - ${file.originalname}`);
        } else {
          resolve(null);
        }
      });
    });

    return {
      file: {
        ...file,
        stream: newTarget,
      },
      waiter,
    };
  }
}
