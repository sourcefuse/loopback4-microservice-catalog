// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';

dotenv.config();
dotenvExt.load({
  schema: '.env.example',
  errorOnMissing: false,
  includeProcessEnv: true,
});
