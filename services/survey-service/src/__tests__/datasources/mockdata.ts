import {SurveyStatus} from '../../enum';
import {Survey} from '../../models';

export const surveyRequestBody = new Survey({
  name: 'Survey Test',
  surveyText: 'JTNDcCUzRWludHJvZHVjdGlvbi4lMjB0byUyMHN1cnZleSUzQyUyRnAlM0U=',
  status: SurveyStatus.DRAFT,
});
