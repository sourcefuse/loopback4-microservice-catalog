import {Provider} from '@loopback/core';
import multer from 'multer';

export class MulterMemoryStorage implements Provider<multer.StorageEngine> {
  value() {
    return multer.memoryStorage();
  }
}
