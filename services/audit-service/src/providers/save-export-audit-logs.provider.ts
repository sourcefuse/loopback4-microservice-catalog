import {inject, Provider, ValueOrPromise} from '@loopback/core';
import {IExportLogsDestinationFn} from '../types';
import {ILogger, LOGGER} from '@sourceloop/core';
import fs from 'fs';
import path from 'path';

export class SaveExportAuditLogsProvider
  implements Provider<IExportLogsDestinationFn>
{
  constructor(@inject(LOGGER.LOGGER_INJECT) public logger: ILogger) {
    /* Do nothing */
  }

  value(): ValueOrPromise<IExportLogsDestinationFn> {
    return {
      saveLogs: async filePath => {
        // Create a full path to the user's download folder
        const downloadFolderPath = path.join(
          require('os').homedir(),
          'Downloads',
        );
        const destinationFilePath = path.join(
          downloadFolderPath,
          'export-log.xlsx',
        );
        fs.copyFile(filePath, destinationFilePath, err => {
          if (err) throw err;
        });
        return 'Download completed';
      },
    };
  }
}
