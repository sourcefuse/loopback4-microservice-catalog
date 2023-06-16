import { Injectable } from '@nestjs/common';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';

@Injectable()
export class PhonesService {
  create(createPhoneDto: CreatePhoneDto) {
    return 'This action adds a new phone';
  }

  findAll() {
    return `This action returns all phones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} phone`;
  }

  update(id: number, updatePhoneDto: UpdatePhoneDto) {
    return `This action updates a #${id} phone`;
  }

  remove(id: number) {
    return `This action removes a #${id} phone`;
  }
}
