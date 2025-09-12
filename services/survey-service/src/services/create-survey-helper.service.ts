import {BindingScope, injectable} from '@loopback/core';
import {AnyObject, Count, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Section, Survey, SurveyDto, SurveyQuestion} from '../models';
import {SectionRepository} from '../repositories/section.repository';
import {SurveyCycleRepository} from '../repositories/survey-cycle.repository';
import {SurveyQuestionRepository} from '../repositories/survey-question.repository';
import {SurveyResponderRepository} from '../repositories/survey-responder.repository';
import {SurveyRepository} from '../repositories/survey.repository';

@injectable({scope: BindingScope.TRANSIENT})
export class CreateSurveyHelperService {
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
  ) {}

  /**
   * The function `copyFromBaseSurvey` copies properties from a base survey to a new survey object in
   * TypeScript.
   * @param survey - The `copyFromBaseSurvey` function takes a parameter `survey` of type
   * `Omit<SurveyDto, 'id'>`. This means that the `survey` parameter should be an object that has all
   * the properties of `SurveyDto` except for the `id` property.
   * @returns The `copyFromBaseSurvey` function returns the `survey` object with the `isEnableWeights`
   * property set based on the corresponding property value from the base survey identified by
   * `baseSurveyId`. If `baseSurveyId` is not provided or the base survey is not found, an error will
   * be thrown.
   */
  async copyFromBaseSurvey(survey: Omit<SurveyDto, 'id'>) {
    if (!survey.baseSurveyId) {
      return survey;
    }
    const baseSurvey = await this.surveyRepository.findById(
      survey.baseSurveyId,
    );
    if (!baseSurvey) {
      throw new HttpErrors.BadRequest('Base Survey Not Valid');
    }

    survey.isEnableWeights = baseSurvey.isEnableWeights;

    return survey;
  }

  async addDependentOnQuestionId(
    surveyId: string,
    existingTemplateQuestions: AnyObject[],
    questionIdMap?: Map<string, string>,
  ) {
    const createdSurveyQuestions = await this.surveyQuestionRepository.find({
      where: {surveyId},
    });
    const updatePromiseArr: Promise<Count>[] = [];
    /*
        consider this example
        qqId(templateQuestions primary id)  qId(questionId)   dqId(dependentQuestionId) 

        header:   qqid    qid     dqid
        qrow1  :   qq1     q1      null
        qrow2  :   qq2     q2      qq1

        header:   sqid    qid     dqid
        srow1  :   sq1     q1      null
        srow2  :   sq2     q2      sq1

        look at the dqid of row2 (sq1), we need to add this. 

        while copying templateQuestions to surveyQuestions we need to follow below algo.
        1. find the templateQuestion where dependentOnQuestionId is not null. (DependentOnQuestionId is basically the templateQuestionId.) In above example we will find qrow2.
        2. as dqid of qrow2 is qq1 so fetch templateQuestion where id = qq1. then we will get qrow1
        3. then find from surveyQuestions where qId = qrow1.qid. We will get srow1.
        4. now we need to put the value of sq1 into dqid column of srow2. 
    */
    existingTemplateQuestions?.forEach(existingTemplateQuestion => {
      // this if condition is step 1 of our algo. here we will get qrow2
      if (existingTemplateQuestion.dependentOnQuestionId) {
        // step 2. here we will get qrow1
        const templateQuestion = existingTemplateQuestions.find(
          templateQuestionObj =>
            templateQuestionObj.id ===
            existingTemplateQuestion.dependentOnQuestionId,
        );

        // step 3. here we will get srow1
        const surveyQuestion = createdSurveyQuestions.find(
          createdSurveyQuestion =>
            createdSurveyQuestion.questionId ===
            (questionIdMap?.get(templateQuestion?.questionId) ??
              templateQuestion?.questionId),
        );

        updatePromiseArr.push(
          this.surveyQuestionRepository.updateAll(
            {
              dependentOnQuestionId: surveyQuestion?.id,
            },
            {
              questionId:
                questionIdMap?.get(existingTemplateQuestion.questionId) ??
                templateQuestion?.questionId,
              surveyId: surveyQuestion?.surveyId,
            },
          ),
        );
      }
    });
    await Promise.all(updatePromiseArr);
  }

  async duplicateSections(
    surveyId: string,
    baseSurveyId: string,
    sectionIdMap: Map<string, string>,
  ) {
    const sections = await this.sectionRepository.find({
      where: {surveyId: baseSurveyId},
    });
    const duplicateSections = await Promise.all(
      sections?.map(section => {
        const toCreateSection = new Section();
        toCreateSection.name = section.name;
        toCreateSection.displayOrder = section.displayOrder;
        toCreateSection.surveyId = surveyId;
        return this.createSection(toCreateSection);
      }),
    );

    for (let i = 0; i < sections?.length; i++) {
      sectionIdMap.set(sections[i].id ?? '', duplicateSections[i]?.id ?? '');
    }
  }

  async createSection(section: Section) {
    await this.sectionRepository.create(section);
    return this.sectionRepository.findOne({
      where: {
        name: section.name,
        displayOrder: section.displayOrder,
        surveyId: section.surveyId,
      },
    });
  }

  async duplicateRespondersAndWorkgroups(
    baseSurveyId: string,
    surveyId: string,
  ) {
    const latestSurveyCycle = await this.surveyCycleRepository.findOne({
      where: {surveyId: baseSurveyId},
      fields: ['id'],
      order: ['created_on DESC'],
    });

    const cycleId = latestSurveyCycle?.id ?? '';

    const surveyRespondersToDuplicate = (
      await this.surveyResponderRepository.find({
        where: {
          surveyCycleId: cycleId,
          surveyId: baseSurveyId,
        },
        fields: [
          'firstName',
          'lastName',
          'email',
          'userId',
          'surveyId',
          'surveyCycleId',
        ],
      })
    )?.map(resp => {
      resp.surveyId = surveyId;
      resp.surveyCycleId = '';
      return resp;
    });
    if (surveyRespondersToDuplicate.length) {
      await this.surveyResponderRepository.createAll(
        surveyRespondersToDuplicate,
      );
    }
  }

  async duplicateSurveyQuestionEntry(
    survey: Omit<SurveyDto, 'id'>,
    createdSurvey: Survey | null,
    questionIdMap: Map<string, string>,
    sectionIdMap: Map<string, string>,
  ) {
    const existingSurveyQuestions = await this.surveyQuestionRepository.find({
      where: {surveyId: survey.baseSurveyId},
    });
    //find survey questions with these question ids and base survey id
    //AND copy them
    const surveyQuestionsToCreate: SurveyQuestion[] = [];
    existingSurveyQuestions?.forEach(existingSurveyQuestion => {
      const surveyQuestion = new SurveyQuestion();
      surveyQuestion.displayOrder = existingSurveyQuestion.displayOrder;
      surveyQuestion.isMandatory =
        existingSurveyQuestion.isMandatory as boolean;
      surveyQuestion.questionId = questionIdMap.has(
        existingSurveyQuestion.questionId,
      )
        ? (questionIdMap.get(existingSurveyQuestion.questionId) as string)
        : existingSurveyQuestion.questionId;
      surveyQuestion.weight = existingSurveyQuestion.weight;
      surveyQuestion.surveyId = createdSurvey?.id as string; //NOSONAR
      if (existingSurveyQuestion.sectionId) {
        surveyQuestion.sectionId = sectionIdMap.has(
          existingSurveyQuestion.sectionId,
        )
          ? (sectionIdMap.get(existingSurveyQuestion.sectionId) as string)
          : existingSurveyQuestion.sectionId;
      }
      surveyQuestionsToCreate.push(surveyQuestion);
    });

    if (surveyQuestionsToCreate.length) {
      await this.surveyQuestionRepository.createAll(surveyQuestionsToCreate);
    }
    await this.addDependentOnQuestionId(
      createdSurvey?.id as string, //NOSONAR
      existingSurveyQuestions,
      questionIdMap,
    );
  }
}
