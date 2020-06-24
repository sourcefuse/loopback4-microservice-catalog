import {bind, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {WorkingHourRepository} from '../repositories';
import {ErrorKeys} from '../models/enums/error-keys';
import {HttpErrors} from '@loopback/rest';
import {WorkingHour} from '../models';

@bind({scope: BindingScope.TRANSIENT})
export class CalendarService {
  constructor(
    @repository(WorkingHourRepository)
    public workingHourRepository: WorkingHourRepository,
  ) {}

  async checkPutValidations(workingHours: WorkingHour[], calendarId: string) {
    const dayOfWeek = [];
    for (const workingHour of workingHours) {
      if (workingHour.calendarId !== calendarId) {
        throw new HttpErrors.UnprocessableEntity(
          ErrorKeys.IdNotMatchedWithParameters,
        );
      }
      dayOfWeek.push(workingHour.dayOfWeek);
    }
    if (dayOfWeek.length !== new Set(dayOfWeek).size) {
      throw new HttpErrors.UnprocessableEntity(ErrorKeys.DuplicateDayOfWeek);
    }
  }

  async deleteWorkingHours(workingHours: WorkingHour[], calendarId: string) {
    const workingHourIds = [];
    for (const workingHour of workingHours) {
      if (workingHour.id !== '') {
        workingHourIds.push(workingHour.id);
      }
    }

    const workingHourFilter = {
      where: {
        calendarId,
        id: {nin: workingHourIds},
      },
    };
    const workingHourToDelete = await this.workingHourRepository.find(
      workingHourFilter,
    );
    for (const workingHour of workingHourToDelete) {
      await this.workingHourRepository.deleteById(workingHour.id);
    }
  }
}
