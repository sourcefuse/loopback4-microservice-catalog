import {TranslateController} from '../../controllers';
import {HttpErrors} from '@loopback/rest';
import {TextType} from '../../types';
import {expect} from '@loopback/testlab';
import {TranslateModelDto} from '../../models';
import {JsdomService, MarkdownService} from '../../services';
import {
  SAMPLE_HTML,
  SAMPLE_MARKDOWN,
  SAMPLE_TEXT,
  setUpAwsTranslateProvider,
  translationsStubObj,
} from './stubs';

describe('TranslateController', () => {
  const {AwsTranslateProvider} = setUpAwsTranslateProvider();
  const awsTranslateProvider = new AwsTranslateProvider({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
  }).value();
  const jsDomServiceClient = new JsdomService(awsTranslateProvider);
  const markDownServiceClient = new MarkdownService(jsDomServiceClient);
  const translateController = new TranslateController(
    jsDomServiceClient,
    markDownServiceClient,
  );
  describe('POST /translations', () => {
    it('throws Bad Request when text is not given', async () => {
      const badRequestError = await translateController
        .makeTranslation({
          text: '',
          type: TextType.TEXT,
          targetLanguage: 'fr',
        } as TranslateModelDto)
        .catch(error => error);
      expect(badRequestError).to.be.instanceOf(HttpErrors.BadRequest);
    });
    it('throws Bad Request when type is not given', async () => {
      const badRequestError = await translateController
        .makeTranslation({
          text: '<p>Sample Text</p>',
          type: '' as TextType,
          targetLanguage: 'fr',
        } as TranslateModelDto)
        .catch(error => error);
      expect(badRequestError).to.be.instanceOf(HttpErrors.BadRequest);
    });
    it('throws Bad Request when target language is not given', async () => {
      const badRequestError = await translateController
        .makeTranslation({
          text: '<p>Sample Text</p>',
          type: TextType.HTML,
          targetLanguage: '',
        } as TranslateModelDto)
        .catch(error => error);
      expect(badRequestError).to.be.instanceOf(HttpErrors.BadRequest);
    });
    it('translates html text', async () => {
      const translatedText = await translateController.makeTranslation({
        text: SAMPLE_HTML,
        type: TextType.HTML,
        targetLanguage: 'fr',
      } as TranslateModelDto);
      expect(translatedText).to.eql(translationsStubObj[SAMPLE_HTML]);
    });
    it('translates markdown text', async () => {
      const translatedText = await translateController.makeTranslation({
        text: SAMPLE_MARKDOWN,
        type: TextType.MARKDOWN,
        targetLanguage: 'fr',
      } as TranslateModelDto);
      expect(translatedText).to.eql(translationsStubObj[SAMPLE_MARKDOWN]);
    });
    it('translates plain text', async () => {
      const translatedText = await translateController.makeTranslation({
        text: SAMPLE_TEXT,
        type: TextType.TEXT,
        targetLanguage: 'fr',
      } as TranslateModelDto);
      expect(translatedText).to.eql(translationsStubObj[SAMPLE_TEXT]);
    });
  });
});
