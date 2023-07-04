import moment from 'moment';
import {SurveyStatus} from '../../enum';
import {Survey} from '../../models';
const currentDate = new Date();

export const surveyRequestBody = new Survey({
  name: 'Survey Test',
  startDate: moment(currentDate).format(),
  endDate: moment(currentDate.setDate(currentDate.getDate() + 10)).format(),
  isPeriodicReassessment: false,
  surveyText: 'JTNDcCUzRWludHJvZHVjdGlvbi4lMjB0byUyMHN1cnZleSUzQyUyRnAlM0U=',
  status: SurveyStatus.DRAFT,
});
