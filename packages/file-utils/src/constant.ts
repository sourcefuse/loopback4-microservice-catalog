// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import multer from 'multer';

const KB = 1024;
const MB = KB * KB;
const FIVE = 5;
export const DEFAULT_MULTER_LIMITS: multer.Options['limits'] = {
  fileSize: FIVE * MB, // 5 MB
  files: 1,
};
export const DEFAULT_TEXT_FILE_TYPES = ['.csv', '.txt', '.svg'];
export const NAME_REGEX = /[!@#$%^&*,.?":{}|<>]/;
