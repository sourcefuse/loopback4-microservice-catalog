import {repository} from '@loopback/repository';
import {CreateSurveyHelperService as CreateSurveyHelperJugglerService} from '../create-survey-helper.service';
import {BindingScope, injectable} from '@loopback/context';
import {
  SurveyCycleRepository,
  SurveyRepository,
  SurveyResponderRepository,
  SectionRepository,
  SurveyQuestionRepository,
} from '../../repositories/sequelize';

@injectable({scope: BindingScope.TRANSIENT})
export class CreateSurveyHelperService extends CreateSurveyHelperJugglerService {
  constructor(
    @repository(SurveyRepository)
    public surveyRepository: SurveyRepository,
    @repository(SurveyQuestionRepository)
    public surveyQuestionRepository: SurveyQuestionRepository,
    @repository(SectionRepository)
    public sectionRepository: SectionRepository,
    @repository(SurveyCycleRepository)
    public surveyCycleRepository: SurveyCycleRepository,
    @repository(SurveyResponderRepository)
    protected surveyResponderRepository: SurveyResponderRepository,
  ) {
    super(
      surveyRepository,
      surveyQuestionRepository,
      sectionRepository,
      surveyCycleRepository,
      surveyResponderRepository,
    );
  }
}
