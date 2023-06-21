import { Module } from '@nestjs/common';
import { PhonesService } from './phones.service';
import { PhonesController } from './phones.controller';

@Module({
  controllers: [PhonesController],
  providers: [PhonesService],
})
export class PhonesModule {}
