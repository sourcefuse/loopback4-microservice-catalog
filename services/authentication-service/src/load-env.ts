import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';

dotenv.config();
dotenvExt.load({
  schema: '.env.example',
  errorOnMissing: true,
  includeProcessEnv: true,
});
