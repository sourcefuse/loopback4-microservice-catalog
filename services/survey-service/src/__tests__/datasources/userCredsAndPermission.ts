import * as jwt from 'jsonwebtoken';
import {PermissionKey} from '../../enum';

process.env.JWT_SECRET = 'kdskssdkdfs';
process.env.JWT_ISSUER = 'sf';
//User Creds
const User = {
  id: 1,
  username: 'test_user',
  password: 'test_password',
};
export const testUserPayload = {
  ...User,
  role: 1,
  authClientId: 2,
  authClientIds: [2],
  deleted: false,
  userLocked: false,
  permissions: [
    PermissionKey.CreateQuestion,
    PermissionKey.ViewQuestion,
    PermissionKey.UpdateQuestion,
    PermissionKey.DeleteQuestion,
    PermissionKey.CreateOption,
    PermissionKey.ViewOption,
    PermissionKey.UpdateOption,
    PermissionKey.ViewOption,
    PermissionKey.DeleteOption,
    PermissionKey.CreateTemplate,
    PermissionKey.ViewTemplate,
    PermissionKey.UpdateTemplate,
    PermissionKey.DeleteTemplate,
    PermissionKey.CreateTemplateQuestion,
    PermissionKey.ViewTemplateQuestion,
    PermissionKey.UpdateTemplateQuestion,
    PermissionKey.DeleteTemplateQuestion,
    PermissionKey.CreateSurvey,
    PermissionKey.ViewSurvey,
    PermissionKey.UpdateSurvey,
    PermissionKey.ViewOpenSurvey,
    PermissionKey.DeleteSurvey,
    PermissionKey.ViewSurveyQuestion,
    PermissionKey.UpdateSurveyQuestion,
    PermissionKey.CreateSurveyQuestion,
    PermissionKey.DeleteSurveyQuestion,
    PermissionKey.CreateSurveyCycle,
    PermissionKey.ViewSurveyCycle,
    PermissionKey.DeleteSurveyCycle,
    PermissionKey.UpdateSurveyCycle,
    PermissionKey.CreateSurveyResponder,
    PermissionKey.CreateResponderReminder,
    PermissionKey.ViewSurveyResponder,
    PermissionKey.UpdateSurveyResponder,
    PermissionKey.DeleteSurveyResponder,
    PermissionKey.CreateSurveySection,
    PermissionKey.ViewSurveySection,
    PermissionKey.ViewOpenSurveySection,
    PermissionKey.UpdateSurveySection,
    PermissionKey.DeleteSurveySection,
    PermissionKey.ViewSurveyResponse,
    PermissionKey.ViewOpenSurveyResponse,
    PermissionKey.CreateSurveyResponse,
    PermissionKey.CreateOpenSurveyResponse,
    PermissionKey.ViewSurveyResponseDetail,
  ],
};
export const token = jwt.sign(testUserPayload, process.env.JWT_SECRET, {
  expiresIn: 180000,
  issuer: process.env.JWT_ISSUER,
});
