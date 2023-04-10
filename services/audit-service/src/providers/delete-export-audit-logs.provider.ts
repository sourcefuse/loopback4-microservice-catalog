import {Provider, ValueOrPromise} from '@loopback/core';
import * as fs from 'fs';
import * as path from 'path';
import {IDeleteLogs} from '../types';

export class DeleteExportAuditLogsProvider implements Provider<IDeleteLogs> {
  value(): ValueOrPromise<IDeleteLogs> {
    return {
      deleteLogs: async targetDirectory => {
        if (targetDirectory === undefined) {
          throw new Error('Path to destination folder not provided');
        } else {
          this.deleteFolderRecursive(targetDirectory);
        }
        return 'Export Files Deleted';
      },
    };
  }
  deleteFolderRecursive(targetDirectory: string) {
    if (fs.existsSync(targetDirectory)) {
      fs.readdirSync(targetDirectory).forEach(function (file) {
        const filePath = path.join(targetDirectory, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          // recursive
          const dir = new DeleteExportAuditLogsProvider();
          dir.deleteFolderRecursive(filePath);
        } else {
          // delete file
          fs.unlinkSync(filePath);
        }
      });
      fs.rmdirSync(targetDirectory);
    }
  }
}
