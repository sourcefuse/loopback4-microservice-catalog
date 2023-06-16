import { PartialType } from '@nestjs/mapped-types';
import { CreatePhoneDto } from './create-phone.dto';

export class UpdatePhoneDto extends PartialType(CreatePhoneDto) {}
